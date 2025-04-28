// apiconfig.js
const API_URL =
  window.location.hostname.includes("vercel.app") ||
  window.location.hostname.includes("wellnessflow.es")
    ? "https://quiroweb-back.onrender.com"
    : "http://localhost:3000";

console.log("API_URL configurada:", API_URL);

export default API_URL;
