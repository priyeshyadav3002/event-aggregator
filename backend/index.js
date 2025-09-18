import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import geocoder from './services/geocoder.js';
import { fetchEvents } from './services/eventApi.js';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to the Event Aggregator API!",
    status: "Service is running correctly."
  });
});

// --- THIS IS THE MISSING ENDPOINT ---
// This is the new, simpler endpoint that the frontend needs.
app.get('/api/events/all', async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: "City is required." });
    }
    try {
        // A simple query to get all events in the database.
        // The discover process is responsible for populating the correct events.
        const { rows } = await db.query(
            `SELECT id, event_name, venue, date, category, description, image_url, ST_AsGeoJSON(location) as location FROM events ORDER BY date DESC`
        );
        const formattedRows = rows.map(row => {
            let location = null;
            if (row.location) {
                const [longitude, latitude] = JSON.parse(row.location).coordinates;
                location = { lat: latitude, lon: longitude };
            }
            return { ...row, location };
        });
        res.json(formattedRows);
    } catch (err) {
        console.error("Database query error:", err.message);
        res.status(500).json({ error: "Failed to fetch events." });
    }
});
// ------------------------------------

// This old endpoint is no longer used by the frontend, but we can keep it.
app.get('/api/events/nearby', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "Lat/lon required." });
  try {
    const { rows } = await db.query(
      `SELECT id, event_name, venue, date, category, description, image_url, ST_AsGeoJSON(location) as location FROM events WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, 20000) OR location IS NULL`,
      [lon, lat]
    );
    const formattedRows = rows.map(row => {
        let location = null;
        if (row.location) {
            const [longitude, latitude] = JSON.parse(row.location).coordinates;
            location = { lat: latitude, lon: longitude };
        }
        return { ...row, location };
    });
    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

app.post('/api/geocode', async (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "City is required." });
  try {
    const geoResult = await geocoder.geocode(city);
    if (geoResult.length === 0) return res.status(404).json({ error: "Location not found." });
    res.json({ lat: geoResult[0].latitude, lon: geoResult[0].longitude });
  } catch (error) {
    res.status(500).json({ error: "Geocoding failed." });
  }
});

app.post('/api/events/discover', async (req, res) => {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: "City is required." });
    try {
        await db.query('DELETE FROM events;'); // Clear old events
        const eventApiData = await fetchEvents(city);
        if (eventApiData.length === 0) {
          return res.status(200).json({ message: `No events found for ${city}.` });
        }
        for (const event of eventApiData) {
            try {
                let locationPoint = null;
                if (event.subtitle && event.subtitle !== "Venue to be confirmed" && event.date) {
                    const locationString = `${event.subtitle}, ${city}`;
                    const geoResult = await geocoder.geocode(locationString);
                    if (geoResult.length > 0) {
                        const { latitude, longitude } = geoResult[0];
                        locationPoint = `POINT(${longitude} ${latitude})`;
                    }
                }
                if (event.date) {
                    await db.query(
                        `INSERT INTO events (event_name, venue, date, category, description, location, image_url)
                         VALUES ($1, $2, $3, $4, $5, ST_GeomFromText($6, 4326), $7)
                         ON CONFLICT (event_name) DO NOTHING`,
                        [event.title, event.subtitle, event.date, event.category, event.description, locationPoint, event.imageUrl]
                    );
                }
            } catch (error) {
                console.error(`Failed to process API event: "${event.title}"`, error.message);
            }
        }
        res.status(201).json({ message: `Discovery complete for ${city}.` });
    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred during discovery." });
    }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});