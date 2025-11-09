import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

 // In-memory Spotify token cache
 let spotifyToken = null;
 let spotifyTokenExpiry = 0; // epoch ms

 async function fetchSpotifyToken() {
 	const clientId = process.env.SPOTIFY_CLIENT_ID;
 	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
 	if (!clientId || !clientSecret) {
 		throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET");
 	}

 	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
 	const params = new URLSearchParams();
 	params.append("grant_type", "client_credentials");

 	const response = await axios.post(
 		"https://accounts.spotify.com/api/token",
 		params,
 		{
 			headers: {
 				Authorization: `Basic ${credentials}`,
 				"Content-Type": "application/x-www-form-urlencoded",
 			},
 		}
 	);

 	const { access_token, expires_in } = response.data;
 	spotifyToken = access_token;
 	// Refresh a little early (10 seconds) to be safe
 	spotifyTokenExpiry = Date.now() + (expires_in - 10) * 1000;
 	return { access_token, expires_in };
 }

 async function getValidSpotifyToken() {
 	if (spotifyToken && Date.now() < spotifyTokenExpiry) {
 		return { access_token: spotifyToken, expires_in: Math.floor((spotifyTokenExpiry - Date.now()) / 1000) };
 	}
 	return await fetchSpotifyToken();
 }

 app.get("/api/health", (req, res) => {
 	res.json({ status: "ok" });
 });

app.get("/api/token", async (req, res) => {
	try {
		const token = await getValidSpotifyToken();
		res.json(token);
	} catch (err) {
		res.status(500).json({ error: "Failed to get Spotify token" });
	}
});

// Debug endpoint to test Spotify API directly
app.get("/api/test-spotify", async (req, res) => {
	try {
		const { access_token } = await getValidSpotifyToken();
		
		// First test: Try a simple API call to verify token works
		console.log("Testing token with a simple API call...");
		const testResponse = await axios.get("https://api.spotify.com/v1/browse/categories", {
			headers: { Authorization: `Bearer ${access_token}` },
		});
		console.log("Token works! Categories API responded.");
		
		// Second test: Try recommendations with pop genre
		const genre = req.query.genre || "pop";
		console.log(`Testing recommendations API with genre: ${genre}`);
		
		const { data } = await axios.get("https://api.spotify.com/v1/recommendations", {
			params: {
				seed_genres: genre,
				limit: 5,
				market: "US"
			},
			headers: { Authorization: `Bearer ${access_token}` },
		});
		
		res.json({ 
			success: true, 
			trackCount: data.tracks?.length || 0,
			tracks: data.tracks?.slice(0, 2).map(t => ({ name: t.name, preview: !!t.preview_url }))
		});
	} catch (err) {
		console.error("Test error:", err.message);
		if (err.response) {
			console.error("Response status:", err.response.status);
			console.error("Response data:", JSON.stringify(err.response.data, null, 2));
			res.status(500).json({ 
				error: "Spotify API test failed",
				status: err.response.status,
				details: err.response.data,
				message: err.message
			});
		} else {
			res.status(500).json({ error: err.message });
		}
	}
});

// Map moods to Spotify seed genres
// Using verified Spotify genre seeds (must be from Spotify's available genres list)
const moodToGenre = {
	happy: "pop",
	sad: "indie", 
	chill: "jazz",
	romantic: "pop",
	party: "electronic",
	energetic: "rock",
	focus: "classical",
};

app.get("/api/recommendations", async (req, res) => {
	try {
		const mood = String(req.query.mood || "").toLowerCase().trim();
		const genre = moodToGenre[mood] || "pop";

		console.log(`Fetching recommendations for mood: "${mood}" -> genre: "${genre}"`);

		const { access_token } = await getValidSpotifyToken();

		// Try Recommendations API first, fallback to Search API if it fails
		let allTracks = [];
		
		try {
			// Try Recommendations API
			const recResponse = await axios.get("https://api.spotify.com/v1/recommendations", {
				params: {
					seed_genres: genre,
					limit: 20,
					market: "US"
				},
				headers: { Authorization: `Bearer ${access_token}` },
			});
			allTracks = recResponse.data.tracks || [];
			console.log(`Recommendations API returned ${allTracks.length} tracks`);
		} catch (recError) {
			console.warn("Recommendations API failed, using Search API as fallback:", recError.response?.status, recError.response?.data);
			
			// Fallback to Search API - search for popular tracks
			// Use a simple search that's more likely to work
			const searchQueries = {
				pop: "year:2020-2024",
				indie: "indie",
				jazz: "jazz",
				electronic: "electronic",
				rock: "rock",
				classical: "classical"
			};
			const searchQuery = searchQueries[genre] || "popular";
			
			const searchResponse = await axios.get("https://api.spotify.com/v1/search", {
				params: {
					q: searchQuery,
					type: "track",
					limit: 20,
					market: "US"
				},
				headers: { Authorization: `Bearer ${access_token}` },
			});
			allTracks = searchResponse.data.tracks?.items || [];
			console.log(`Search API returned ${allTracks.length} tracks`);
		}
		console.log(`Received ${allTracks.length} tracks from Spotify`);

		// Prioritize tracks with preview URLs, but include others if needed
		const tracksWithPreview = allTracks.filter(t => !!t.preview_url);
		const tracksWithoutPreview = allTracks.filter(t => !t.preview_url);
		
		// Take up to 10 tracks, prioritizing those with previews
		const selectedTracks = [
			...tracksWithPreview.slice(0, 10),
			...tracksWithoutPreview.slice(0, Math.max(0, 10 - tracksWithPreview.length))
		].slice(0, 10);

		const tracks = selectedTracks.map(t => ({
			id: t.id,
			name: t.name,
			artists: (t.artists || []).map(a => ({ name: a.name })),
			albumArt: t.album?.images?.[0]?.url || null,
			previewUrl: t.preview_url || null,
			spotifyUrl: t.external_urls?.spotify || null,
		}));

		console.log(`Returning ${tracks.length} tracks (${tracksWithPreview.length} with previews)`);

		res.json(tracks);
	} catch (err) {
		console.error("Error fetching recommendations:", err.message);
		console.error("Full error:", err);
		if (err.response) {
			console.error("Spotify API error status:", err.response.status);
			console.error("Spotify API error data:", JSON.stringify(err.response.data, null, 2));
			return res.status(500).json({ 
				error: "Failed to fetch recommendations",
				details: err.response.data?.error?.message || err.message,
				status: err.response.status
			});
		}
		res.status(500).json({ 
			error: "Failed to fetch recommendations",
			details: err.message
		});
	}
});

 // Serve React build in production
 if (process.env.NODE_ENV === "production") {
 	const clientDist = path.resolve(__dirname, "../../client/dist");
 	app.use(express.static(clientDist));
 	app.get("*", (req, res) => {
 		res.sendFile(path.resolve(clientDist, "index.html"));
 	});
 }

app.listen(PORT, () => {
	console.log(`Moodify server running on http://localhost:${PORT}`);
}).on("error", (err) => {
	if (err.code === "EADDRINUSE") {
		console.error(`❌ Port ${PORT} is already in use. Please free the port or change PORT in .env`);
		console.error(`   To find and kill the process: netstat -ano | findstr :${PORT}`);
		process.exit(1);
	} else {
		console.error("Server error:", err);
		process.exit(1);
	}
});


