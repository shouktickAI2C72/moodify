 export default function SongCard({ track }) {
   return (
     <div className="group bg-white/10 border border-white/10 rounded-xl p-4 hover:bg-white/15 transition shadow-lg hover:shadow-xl hover:shadow-fuchsia-500/20">
       <div className="aspect-square w-full overflow-hidden rounded-lg">
         {track.albumArt ? (
           <img src={track.albumArt} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
         ) : (
           <div className="w-full h-full bg-white/10" />
         )}
       </div>

       <div className="mt-3">
         <h3 className="font-semibold line-clamp-1">{track.name}</h3>
         <p className="text-sm text-white/70 line-clamp-1">
           {(track.artists || []).map(a => a.name).join(", ")}
         </p>
       </div>

       <div className="mt-3">
         {track.previewUrl ? (
           <audio controls src={track.previewUrl} className="w-full" />
         ) : (
           <a
             className="inline-block px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition"
             href={track.spotifyUrl || "#"}
             target="_blank" rel="noreferrer"
           >
             Play on Spotify
           </a>
         )}
       </div>
     </div>
   );
 }

