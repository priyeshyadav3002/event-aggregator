🤖 AI-Powered Local Event Finder
A full-stack web application that discovers, analyzes, and displays local events from any city in India. This project uses a professional-grade tech stack, including a React frontend, a Node.js/Express backend, and a PostgreSQL database. It leverages the SerpApi for real-time data fetching from Google and a geocoding service to provide location data.

This application was built to showcase a range of modern web development skills, including API integration, database management, and building a responsive, user-friendly interface.

✨ Core Features
Live Event Discovery: Fetches real-time event data for any searched city using the SerpApi.

Intelligent Geocoding: Converts venue names into precise latitude and longitude coordinates to display on a map or link to Google Maps.

Dynamic Filtering: Allows users to filter the displayed events by a specific date.

Smart Suggestions: If a specific filter returns few results, the app intelligently suggests other upcoming events to ensure the user always has options.

Attractive UI: A modern, dark-themed, and fully responsive user interface with "skeleton" loaders for an excellent user experience.

Robust Caching: The backend caches recent search results to provide instantaneous responses for popular cities and reduce API usage.

🛠️ Technology Stack
Frontend:

React: For building the component-based user interface.

Create React App: As the build toolchain.

Axios: For making HTTP requests to the backend.

Backend:

Node.js: As the JavaScript runtime environment.

Express.js: As the web server framework for the RESTful API.

PostgreSQL (via Neon): As the relational database for storing event data.

PostGIS: The geospatial extension for PostgreSQL to handle location-based queries.

External Services:

SerpApi: For fetching live, structured event data from Google Search results.

OpenStreetMap (via node-geocoder): For converting venue addresses into geographic coordinates.

📂 Project Structure
The project is organized into two distinct top-level directories for a clean separation of concerns.

/
├── backend/      # Contains the Node.js/Express backend server
└── frontend/     # Contains the React frontend application

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later)

npm (comes with Node.js)

A Neon account for the PostgreSQL database.

A SerpApi account for the event data API key.

Installation & Setup
Clone the Repository:

git clone [https://github.com/YOUR_USERNAME/event-aggregator.git](https://github.com/YOUR_USERNAME/event-aggregator.git)

Backend Setup:

Navigate to the backend folder: cd backend

Install dependencies: npm install

Create a .env file and add your DATABASE_URL and SERPAPI_API_KEY.

Start the server: npm start

Frontend Setup:

Navigate to the frontend folder in a new terminal: cd frontend

Install dependencies: npm install

Start the application: npm start

The frontend will be available at http://localhost:3000, and the backend at http://localhost:8080.
