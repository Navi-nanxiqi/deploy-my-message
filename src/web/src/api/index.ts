import axios from "axios";

// const protocal = window.location.protocol;
// const hostName = window.location.hostname;
// const port = window.location.port;
// const fullAddress = `${hostName}:${port}`;
// const url = `${protocal}//${fullAddress}/${import.meta.env.VITE_SERVER_NAME}`;
const url = "http://localhost:3001/api";

export const http = axios.create({
    baseURL: url,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});
