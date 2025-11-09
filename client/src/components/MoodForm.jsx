 import { useState } from "react";

 export default function MoodForm({ onSubmit, loading }) {
   const [value, setValue] = useState("");

   return (
     <form
       className="flex flex-col sm:flex-row items-center gap-3"
       onSubmit={(e) => {
         e.preventDefault();
         const v = value.trim();
         if (v) onSubmit(v);
       }}
     >
       <input
         type="text"
         placeholder="How are you feeling? (e.g. happy, sad, chill)"
         value={value}
         onChange={(e) => setValue(e.target.value)}
         className="w-full flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
       />
       <button
         type="submit"
         disabled={loading}
         className="px-6 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-glow"
       >
         {loading ? "Getting Vibes…" : "Get Vibes"}
       </button>
     </form>
   );
 }

