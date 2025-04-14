// apiConfig.js
const API_URL = window.location.hostname.includes("vercel.app")
  ? "https://quiroweb-back.onrender.com"
  : "http://localhost:3000";

console.log("API_URL configurada:", API_URL);

export default API_URL;
