import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === 'development' ? 'https://gura-online-bn.onrender.com' : "/",
    // Remove withCredentials
});

export default axiosInstance;
