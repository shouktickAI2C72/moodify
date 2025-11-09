 import { useEffect, useMemo, useState } from "react";
 import Header from "./components/Header.jsx";
 import MoodForm from "./components/MoodForm.jsx";
 import SongCard from "./components/SongCard.jsx";
 import Footer from "./components/Footer.jsx";

 const moodGradients = {
   happy: "from-yellow-400 via-orange-400 to-pink-500",
   sad: "from-blue-900 via-indigo-800 to-slate-900",
   chill: "from-purple-700 via-teal-600 to-slate-900",
   romantic: "from-rose-600 via-pink-600 to-purple-700",
   party: "from-fuchsia-600 via-purple-600 to-cyan-500",
   energetic: "from-amber-500 via-red-600 to-orange-600",
   focus: "from-emerald-600 via-teal-700 to-slate-900",
 };

 export default function App() {
   const [mood, setMood] = useState("");
   const [tracks, setTracks] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const gradient = useMemo(() => {
     const key = (mood || "").toLowerCase();
     return moodGradients[key] || "from-slate-900 via-slate-800 to-slate-900";
   }, [mood]);

   useEffect(() => {
     document.documentElement.style.setProperty("--tw-bg-opacity", "1");
   }, []);

  async function fetchRecommendations(userMood) {
    const q = encodeURIComponent(userMood);
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/recommendations?mood=${q}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.details || "Failed to fetch recommendations");
      }
      if (!Array.isArray(data) || data.length === 0) {
        setError("No tracks found. Try a different mood!");
        setTracks([]);
      } else {
        setTracks(data);
      }
    } catch (e) {
      setError(e.message || "Something went wrong");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }

   return (
     <div className={`min-h-screen font-poppins bg-gradient-to-br ${gradient} text-white transition-colors duration-500`}>
       <div className="relative min-h-screen">
         <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

         <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
           <Header />

           <main className="flex-1 flex flex-col items-center">
             <div className="w-full max-w-3xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-md p-6 md:p-8 mt-6">
               <MoodForm
                 onSubmit={(m) => {
                   setMood(m);
                   fetchRecommendations(m);
                 }}
                 loading={loading}
               />

               {error && (
                 <p className="mt-4 text-rose-200 text-center">{error}</p>
               )}

               {loading && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                   {Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="animate-pulse bg-white/10 h-56 rounded-xl" />
                   ))}
                 </div>
               )}

               {!loading && tracks.length > 0 && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                   {tracks.map((t) => (
                     <SongCard key={t.id} track={t} />)
                   )}
                 </div>
               )}

               {!loading && !error && tracks.length === 0 && (
                 <p className="text-center mt-6 text-white/80">Try moods like: happy, sad, chill, romantic, party, energetic, focus</p>
               )}
             </div>
           </main>

           <Footer />
         </div>
       </div>
     </div>
   );
 }


