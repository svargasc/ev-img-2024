import axios from "axios";

const instance = axios.create({
    baseURL: 'https://events-cqtw.onrender.com',
    withCredentials: true
})

export default instance