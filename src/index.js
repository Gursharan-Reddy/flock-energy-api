const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { authenticate, getMeters, getMeterDetails, getMeterConsumption } = require('./client');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..')));

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/v1/meters', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const meters = await getMeters(page);
        res.json(meters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/v1/meters/:id', async (req, res) => {
    try {
        const meterId = req.params.id;
        const details = await getMeterDetails(meterId);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/api/v1/meters/:id/consumption', async (req, res) => {
    try {
        const meterId = req.params.id;
        const consumption = await getMeterConsumption(meterId);
        res.json(consumption);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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