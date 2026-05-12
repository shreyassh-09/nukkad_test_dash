import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/dashboard',
});

export const fetchSeoHistory = async (domain = 'gonukkad.com') => {
  try {
    const response = await API.get(`/seo-history?domain=${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    throw error;
  }
};