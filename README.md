# cafe-finder

Cafe Finder is a small web app that helps you discover nearby cafés and coffee shops. It uses the browser’s geolocation plus the Google Places API to find spots around you, show a photo, and let you either save the café or skip to the next one.

**Live Demo:**
https://maruuu26.github.io/cafe-finder/

## Features

- **Nearby café search** – Uses the browser’s geolocation and Google Places API (New Places) to find places near the user.
- **Photo cards** – Displays a photo, name, address, and category for each café in a clean card-style UI.
- **Saved cafés** – Users can save cafés, then view and manage them on a separate **Saved Cafes** page using `localStorage` (no backend required).
- **Open in Maps** – Each café can be opened directly in Google Maps for directions.
- **Responsive UI** – Designed with vanilla HTML/CSS for a mobile-friendly, pill-shaped card layout and subtle hover/tap states.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **API:** Google Places API (New) + Places Photos
- **Storage:** `localStorage` (saved cafés)
- **Deployment:** GitHub Pages

## API Key & Security

This is a frontend-only project, so the API key is used in the browser. To keep it safe:

- The key is **restricted by HTTP referrer** (only works on my GitHub Pages domain and localhost).
- The key is **restricted by API** (Places API only).
- The key can be rotated at any time from Google Cloud Console.

## How to Run Locally

1. Clone the repo:

   ```bash
   git clone https://github.com/<your-username>/cafe-finder.git
   cd cafe-finder
2. Create a config.js file in the project root:
   const CONFIG = {GOOGLE_PLACES_API_KEY: "ADD_API_KEY_HERE"};
3. Open using VS Code Liver Server or open index.html in your browser
4. Allow location access when prompted
