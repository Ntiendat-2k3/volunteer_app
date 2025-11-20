import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:4000/api', withCredentials: true // quan trọng để gửi nhận cookie session
});

axiosClient.interceptors.response.use((response) => response, (error) => { // Có thể handle 401 ở đây
    return Promise.reject(error);
});

export default axiosClient;
