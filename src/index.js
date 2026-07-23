// src/index.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { authenticate, getMeters, getMeterDetails, getMeterConsumption } = require('./client');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like index.html) from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Load Swagger documentation definition
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Serve Swagger UI documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * GET /api/v1/meters
 * Fetches a paginated list of meters.
 */
app.get('/api/v1/meters', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const meters = await getMeters(page);
        res.json(meters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/meters/:id
 * Fetches specific meter details (geo/location).
 */
app.get('/api/v1/meters/:id', async (req, res) => {
    try {
        const meterId = req.params.id;
        const details = await getMeterDetails(meterId);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/meters/:id/consumption
 * Fetches historical energy consumption for a specific meter.
 */
app.get('/api/v1/meters/:id/consumption', async (req, res) => {
    try {
        const meterId = req.params.id;
        const consumption = await getMeterConsumption(meterId);
        res.json(consumption);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server and perform initial authentication check
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/docs`);
    try {
        await authenticate();
        console.log("Initial session authentication established.");
    } catch (err) {
        console.error("Initial authentication warning:", err.message);
    }
});