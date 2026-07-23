// src/index.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { 
    authenticate, 
    getMeters, 
    getMeterDetails, 
    getMeterConsumption 
} = require('./client');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load OpenAPI specification
const openapiPath = path.join(__dirname, '../openapi.json');
let swaggerDocument = {};
if (fs.existsSync(openapiPath)) {
    swaggerDocument = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Initial Authentication on Boot
authenticate().catch(err => console.error("Initial auth failed:", err));

// --- REST Endpoints ---

app.get('/api/v1/meters', async (req, res) => {
    try {
        const meters = await getMeters();
        res.json(meters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/v1/meters/:id', async (req, res) => {
    try {
        const details = await getMeterDetails(req.params.id);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/v1/meters/:id/consumption', async (req, res) => {
    try {
        const consumption = await getMeterConsumption(req.params.id);
        res.json(consumption);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/docs`);
});