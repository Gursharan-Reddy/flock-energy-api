const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const BASE_URL = 'https://urja-ops.flockenergy.tech';
const USERNAME = 'operator@urja.local';
const PASSWORD = 'urja-ops-2026';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true, baseURL: BASE_URL }));

async function authenticate() {
    try {
        const payload = new URLSearchParams();
        payload.append('email', USERNAME);
        payload.append('password', PASSWORD);

        const response = await client.post('/login', payload, {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Origin': 'https://urja-ops.flockenergy.tech',
                'Referer': 'https://urja-ops.flockenergy.tech/login',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        
        if (response.status === 200 || response.status === 302) {
            console.log("Authentication successful.");
            return true;
        }
        return false;
    } catch (error) {
        console.error("Authentication failed:", error.response ? error.response.status : error.message);
        throw new Error("Failed to authenticate with Urja portal");
    }
}


async function getMeters(page = 1) {
    try {
        const response = await client.get(`/portal/meters/search?q=&page=${page}`, {
            headers: { 'Accept': 'application/json' }
        }); 
        
        if (response.request?.path?.includes('/login') || response.status === 401) {
            await authenticate();
            return getMeters(page); 
        }

        return response.data; 
    } catch (error) {
        throw new Error(`Failed to fetch meters: ${error.message}`);
    }
}

async function getMeterDetails(meterId) {
    try {
        const response = await client.get(`/portal/meters/${meterId}/geo`, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.request?.path?.includes('/login') || response.status === 401) {
            await authenticate();
            return getMeterDetails(meterId);
        }

        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch details for meter ${meterId}: ${error.message}`);
    }
}

async function getMeterConsumption(meterId) {
    try {
        const response = await client.get(`/portal/meters/${meterId}/energy`, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.request?.path?.includes('/login') || response.status === 401) {
            await authenticate();
            return getMeterConsumption(meterId);
        }

        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch consumption for meter ${meterId}: ${error.message}`);
    }
}

module.exports = { 
    authenticate, 
    getMeters, 
    getMeterDetails, 
    getMeterConsumption 
};