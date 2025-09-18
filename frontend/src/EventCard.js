import React from 'react';

// This is the UI for a single, complete event card.
export function EventCard({ event }) {
    const googleMapsUrl = event.location
        ? `https://www.google.com/maps/search/?api=1&query=${event.location.lat},${event.location.lon}`
        : null;

    return (
        <div className="event-card">
            {event.image_url && (
                <img src={event.image_url} alt={event.event_name} className="event-image" />
            )}
            <div className="event-details">
                <h3>{event.event_name}</h3>
                <p className="event-venue">{event.venue}</p>
                <p className="event-date">{event.date ? new Date(event.date).toLocaleString() : 'Date not specified'}</p>
                <div className="event-footer">
                    <span className="event-category">{event.category}</span>
                    {googleMapsUrl && (
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="map-button">
                            View on Map
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// This is the UI for the "skeleton" loading card placeholder.
export function SkeletonCard() {
    return (
        <div className="event-card skeleton">
            <div className="event-image skeleton-img" />
            <div className="event-details">
                <div className="skeleton-text" style={{ width: '70%', height: '24px' }} />
                <div className="skeleton-text" style={{ width: '50%' }} />
                <div className="skeleton-text" style={{ width: '80%' }} />
            </div>
        </div>
    );
}