import axios from 'axios'


const api = axios.create({
baseURL: 'http://localhost:8000', // API gateway placeholder
timeout: 10000,
})


export default api