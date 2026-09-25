import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://datastraw-support-crmb.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
