 /** @type {import('tailwindcss').Config} */
 export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
     extend: {
       fontFamily: {
         poppins: ["Poppins", "ui-sans-serif", "system-ui"],
       },
       boxShadow: {
         glow: "0 0 20px rgba(168,85,247,0.6)",
       },
       backdropBlur: {
         xs: "2px",
       },
     },
   },
   plugins: [],
 };

