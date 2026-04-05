const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const helmet = require('helmet');
const compression = require('compression');

dotenv.config();

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* ── Mood → search queries + theme color ──────────────────────────── */
const moodProfiles = {
  happy: {
    queries: ['happy pop hits', 'feel good summer', 'upbeat dance pop'],
    color: '#f59e0b',
  },
  sad: {
    queries: ['sad songs heartbreak', 'emotional ballad crying', 'sad piano'],
    color: '#6366f1',
  },
  chill: {
    queries: ['chill lofi beats', 'relaxed acoustic vibes', 'chill indie'],
    color: '#06b6d4',
  },
  energetic: {
    queries: ['energetic workout hits', 'high energy dance', 'pump up rock'],
    color: '#ef4444',
  },
  romantic: {
    queries: ['romantic love songs', 'love ballad r&b', 'romantic duet'],
    color: '#ec4899',
  },
  spiritual: {
    queries: ['spiritual meditation music', 'devotional songs peaceful', 'healing ambient'],
    color: '#a855f7',
  },
  motivated: {
    queries: ['motivational songs power', 'inspirational anthem', 'never give up rap'],
    color: '#f97316',
  },
  demotivated: {
    queries: ['melancholic indie slow', 'sad acoustic reflective', 'lonely night songs'],
    color: '#64748b',
  },
  angry: {
    queries: ['angry rock metal', 'aggressive rap', 'rage hard rock'],
    color: '#dc2626',
  },
  focus: {
    queries: ['focus study ambient', 'concentration classical', 'deep focus electronic'],
    color: '#0ea5e9',
  },
  nostalgic: {
    queries: ['nostalgic 90s hits', 'throwback classic pop', 'retro 80s songs'],
    color: '#d97706',
  },
  party: {
    queries: ['party dance hits', 'club banger edm', 'party anthems pop'],
    color: '#e11d48',
  },
  peaceful: {
    queries: ['peaceful piano calm', 'nature ambient relaxing', 'peaceful classical'],
    color: '#10b981',
  },
  confident: {
    queries: ['confident hip hop', 'boss empowering rap', 'swagger pop'],
    color: '#8b5cf6',
  },
  melancholy: {
    queries: ['melancholy indie folk', 'bittersweet alternative', 'atmospheric sad'],
    color: '#475569',
  },
  grateful: {
    queries: ['grateful thankful songs', 'uplifting gospel', 'blessing songs'],
    color: '#16a34a',
  },
};

function getMoodProfile(mood) {
  const key = mood.toLowerCase().trim();
  if (moodProfiles[key]) return { ...moodProfiles[key], mood: key };
  return {
    queries: [`${key} songs`, `${key} music`, key],
    color: '#6366f1',
    mood: key,
  };
}

/* ── iTunes Search (FREE, no auth, reliable) ──────────────────────── */
async function searchiTunes(query, limit) {
  try {
    const resp = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: query,
        media: 'music',
        entity: 'song',
        limit: limit,
      },
      timeout: 10000,
    });

    return (resp.data.results || []).map((t) => ({
      id: `itunes-${t.trackId}`,
      name: t.trackName || 'Unknown',
      artists: [t.artistName || 'Unknown Artist'],
      album: {
        name: t.collectionName || 'Unknown Album',
        images: [
          { url: (t.artworkUrl100 || '').replace('100x100', '600x600') },
          { url: t.artworkUrl100 || '' },
          { url: (t.artworkUrl100 || '').replace('100x100', '60x60') },
        ],
      },
      preview_url: t.previewUrl || null,
      external_url: t.trackViewUrl || t.collectionViewUrl || '',
      duration_ms: t.trackTimeMillis || 30000,
      popularity: t.trackNumber || 0,
    }));
  } catch (err) {
    console.error('iTunes search error:', err.message);
    return [];
  }
}

/* ── Spotify search (optional, only if credentials are real) ──────── */
let tokenCache = { access_token: null, expires_at: 0 };

function hasSpotifyCredentials() {
  const id = process.env.SPOTIFY_CLIENT_ID || '';
  const secret = process.env.SPOTIFY_CLIENT_SECRET || '';
  return (
    id && secret &&
    id !== 'your_spotify_client_id' &&
    secret !== 'your_spotify_client_secret' &&
    id.length > 10 && secret.length > 10
  );
}

async function getSpotifyToken() {
  const now = Date.now();
  if (tokenCache.access_token && tokenCache.expires_at > now + 5000) {
    return tokenCache.access_token;
  }
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const resp = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      },
      timeout: 8000,
    }
  );
  tokenCache.access_token = resp.data.access_token;
  tokenCache.expires_at = now + resp.data.expires_in * 1000;
  return tokenCache.access_token;
}

async function searchSpotify(query, limit) {
  try {
    const token = await getSpotifyToken();
    const resp = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: limit * 2 },
      timeout: 8000,
    });
    return (resp.data.tracks.items || []).map((t) => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map((a) => a.name),
      album: {
        name: t.album.name,
        images: t.album.images,
      },
      preview_url: t.preview_url,
      external_url: t.external_urls.spotify,
      duration_ms: t.duration_ms,
      popularity: t.popularity,
    }));
  } catch (err) {
    console.error('Spotify search error:', err.message);
    return [];
  }
}

/* ── GET /api/search?mood=<mood>&limit=<n> ────────────────────────── */
app.get('/api/search', async (req, res) => {
  try {
    const mood = (req.query.mood || '').toLowerCase().trim();
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);

    if (!mood) {
      return res.status(400).json({ error: 'mood query parameter is required' });
    }

    const profile = getMoodProfile(mood);
    const useSpotify = hasSpotifyCredentials();

    // Pick a random query variant for variety each time
    const query = profile.queries[Math.floor(Math.random() * profile.queries.length)];
    let allTracks = [];
    let source = 'itunes';

    // Try Spotify first if credentials are available
    if (useSpotify) {
      console.log(`🎵 Searching Spotify for: "${query}"`);
      allTracks = await searchSpotify(query, limit);
      if (allTracks.length > 0) source = 'spotify';
    }

    // Fallback to iTunes (always works, free, no key needed)
    if (allTracks.length === 0) {
      console.log(`🎵 Searching iTunes for: "${query}"`);
      allTracks = await searchiTunes(query, limit);
      source = 'itunes';
    }

    // If first query didn't work, try alternatives
    if (allTracks.length === 0) {
      for (const altQuery of profile.queries) {
        if (altQuery === query) continue;
        console.log(`🎵 Retrying iTunes with: "${altQuery}"`);
        allTracks = await searchiTunes(altQuery, limit);
        if (allTracks.length > 0) break;
      }
    }

    if (allTracks.length === 0) {
      return res.status(404).json({ error: 'No tracks found for that mood. Try a different one!' });
    }

    // Prefer tracks with preview URLs
    const withPreview = allTracks.filter((t) => t.preview_url);
    const pool = withPreview.length >= limit ? withPreview : allTracks;
    const selected = pool.slice(0, limit);

    console.log(`✅ Found ${selected.length} tracks via ${source}`);

    res.json({
      mood: profile.mood,
      color: profile.color,
      tracks: selected,
      total: selected.length,
      source,
    });
  } catch (err) {
    console.error('Search error:', err.message || err);
    res.status(500).json({ error: 'Search failed. Please try again.', details: err.message });
  }
});

/* ── GET /api/moods — list available moods ────────────────────────── */
app.get('/api/moods', (req, res) => {
  const moods = Object.entries(moodProfiles).map(([key, val]) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    color: val.color,
  }));
  res.json({ moods });
});

/* ── Health check ─────────────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    musicSource: hasSpotifyCredentials() ? 'Spotify (primary) + iTunes (fallback)' : 'iTunes (free)',
  });
});

/* ── Serve client in production ───────────────────────────────────── */
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const clientDist = path.resolve(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🎧 Moodify server listening on http://localhost:${PORT}`);
  if (hasSpotifyCredentials()) {
    console.log('✅ Spotify credentials detected — using Spotify + iTunes fallback');
  } else {
    console.log('🎵 Using iTunes Search API (free, no key needed)');
    console.log('💡 Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env for Spotify support');
  }
});
