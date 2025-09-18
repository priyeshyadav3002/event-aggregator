import { getJson } from "serpapi";
import dotenv from 'dotenv';
dotenv.config();

const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

function parseEventDate(dateInfo) {
    if (!dateInfo || !dateInfo.start_date) return null;
    const startDate = dateInfo.start_date;
    const currentYear = new Date().getFullYear();
    try {
        const dateWithYear = `${startDate}, ${currentYear}`;
        const parsedDate = new Date(dateWithYear);
        if (!isNaN(parsedDate.getTime())) return parsedDate;
    } catch (e) {}
    console.warn(`Could not parse date: "${startDate}"`);
    return null;
}

export async function fetchEvents(city) {
    if (!SERPAPI_API_KEY) throw new Error("SerpApi API key is not configured.");
    console.log(`Fetching events from Google Events API (via SerpApi) for: ${city}`);

    const params = {
        api_key: SERPAPI_API_KEY,
        engine: "google_events",
        q: `events in ${city}`,
        location: "India",
        hl: "en"
    };

    try {
        const json = await getJson(params);
        if (!json.events_results) {
            console.log(`No event results found for ${city}.`);
            return [];
        }

        const events = json.events_results.map(event => {
            const parsedDate = parseEventDate(event.date);
            return {
                title: event.title,
                subtitle: event.venue?.name || "Venue to be confirmed",
                category: event.event_location_map?.type || "General",
                description: event.description || event.title,
                date: parsedDate,
                // --- THIS IS THE NEW PART ---
                // We are now extracting the event's thumbnail image URL from the API response.
                imageUrl: event.thumbnail
                // --------------------------
            };
        });

        console.log(`Successfully fetched ${events.length} events from API.`);
        return events;
    } catch (error) {
        console.error("Error fetching from SerpApi:", error.message);
        return [];
    }
}