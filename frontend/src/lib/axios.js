import axios from "axios";

// Dynamic url for when in production mode else localhost if in development mode
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

// Used for sending request to our frontend and linking both frontend and backend
export const axiosInstance = axios.create({
    baseURL: BASE_URL, // URL of our backend routes
    withCredentials: true, // send cookies with the request
})