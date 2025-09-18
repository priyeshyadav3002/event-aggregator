import React, { useState } from 'react';
import axios from 'axios';
import { EventCard, SkeletonCard } from './EventCard';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import './App.css';

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
        setStatusMessage(response.data.length === 0 ? 'No events found. Try another city!' : '');
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
    setStatusMessage(''); 

    try {
      await axios.post('http://localhost:8080/api/events/discover', { city: searchCity });
      fetchEventsForCity(searchCity);
    } catch (err) {
      console.error("An error occurred during the search process:", err);
      setStatusMessage(`Failed to find events for ${searchCity}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-title">
            <TravelExploreIcon sx={{ fontSize: 40 }} />
            <h1>Local Event Finder</h1>
        </div>
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
        <div className="event-list">
          <h2>Upcoming Events</h2>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
          
          <div className="event-grid">
            {isLoading && Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
            
            {!isLoading && !statusMessage && events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;