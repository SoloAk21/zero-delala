import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const apiClient = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export const checkBackendHealth = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 3000 });
        return response.status === 200 || response.status === 503;
    }
    catch (error) {
        return false;
    }
};
export const syncUserWithBackend = async (userData) => {
    try {
        const response = await apiClient.post('/bot/sync-user', userData);
        return response.data;
    }
    catch (error) {
        console.error('[Zero Delala Bot] Backend sync failed:', error.message);
        return null;
    }
};
