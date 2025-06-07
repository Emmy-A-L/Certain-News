import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:4040/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;