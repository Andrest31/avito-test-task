import axios from 'axios';


export const apiClient = axios.create({
  baseURL: '/api', // Будет проксироваться через Vite
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})