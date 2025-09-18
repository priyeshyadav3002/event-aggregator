import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// We no longer need Leaflet!

function App() {
  const [events, setEvents] = useState([]);
  const [searchCity, setSearchCity] = useState("Kanpur");
  const [statusMessage, setStatusMessage] = useState('Click Search to find events!');
  const [isLoading, setIsLoading] = useState(false);

  const fetchEventsForCity = (city) => {
    setStatusMessage('Fetching events...');
    axios.get(`http://localhost:8080/api/events/all?city=${city}`)
      .then(response => {
        setEvents(response.data);
        setStatusMessage(response.data.length === 0 ? 'No events found for this location. Try another city!' : '');
      })
      .catch(err => {
        setEvents([]);
        setStatusMessage('Could not fetch events.');
      });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCity || isLoading) return;
    setIsLoading(true);
    setEvents([]); 
    try {
      setStatusMessage(`Discovering events for ${searchCity}...`);
      await axios.post('http://localhost:8080/api/events/discover', { city: searchCity });

      setStatusMessage('Fetching updated event list...');
      fetchEventsForCity(searchCity);

    } catch (err) {
      console.error("An error occurred during the search process:", err);
      setStatusMessage(`Failed to find events for ${searchCity}.`);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Local Event Finder</h1>
        <p>Discover what's happening near you</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Enter a city name..."
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>
      <div className="main-content">
        {/* The map container is now completely gone! */}
        <div className="event-list">
          <h2>Upcoming Events</h2>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
          
          {!statusMessage && events.map(event => {
            // Construct the Google Maps URL if location exists
            const googleMapsUrl = event.location 
              ? `https://www.google.com/maps/search/?api=1&query=${event.location.lat},${event.location.lon}`
              : null;

            return (
              <div key={event.id} className="event-card">
                {event.image_url && (
                  <img src={event.image_url} alt={event.event_name} className="event-image" />
                )}
                <div className="event-details">
                  <h3>{event.event_name}</h3>
                  <p className="event-venue">{event.venue}</p>
                  <p className="event-date">{event.date ? new Date(event.date).toLocaleString() : 'Date not specified'}</p>
                  <div className="event-footer">
                    <span className="event-category">{event.category}</span>
                    {/* Only show the button if we have a valid URL */}
                    {googleMapsUrl && (
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="map-button">
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;