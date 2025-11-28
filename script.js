// script.js — using Google Places API (New) Nearby Search

// ---------- DOM ELEMENTS ----------
const statusText = document.getElementById("status-text");
const cafeCard = document.getElementById("cafe-card");
const emptyState = document.getElementById("empty-state");
const retryBtn = document.getElementById("retry-btn");

const cafeNameEl = document.getElementById("cafe-name");
const cafeAddressEl = document.getElementById("cafe-address");
const cafeDistanceEl = document.getElementById("cafe-distance");
const cafeCategoryEl = document.getElementById("cafe-category");
const mapLinkEl = document.getElementById("map-link");

const saveBtn = document.getElementById("save-btn");
const skipBtn = document.getElementById("skip-btn");

// ---------- STATE ----------
let cafes = [];
let currentIndex = 0;

// ---------- GOOGLE PLACES (NEW) CONFIG ----------
const GOOGLE_PLACES_API_KEY = CONFIG.GOOGLE_PLACES_API_KEY;
const PLACES_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";

// Show / hide card + empty state
function openState(cardVisible, emptyVisible, statusMessage) {
  cafeCard.hidden = !cardVisible;
  emptyState.hidden = !emptyVisible;
  if (statusMessage !== undefined) {
    statusText.textContent = statusMessage;
  }
}

// ---------- FETCH CAFES (Nearby Search New) ----------

async function fetchCafes(lat, lon) {
  statusText.textContent = "Searching for nearby cafes...";

  const body = {
    // only cafes
    includedTypes: ["cafe"],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lon
        },
        radius: 2000.0 // meters
      }
    },
    rankPreference: "DISTANCE"
  };

  try {
    const response = await fetch(PLACES_NEARBY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        // field mask = which fields we want back
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.types"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error("Places API error status:", response.status);
      const errText = await response.text();
      console.error("Places API body:", errText);
      throw new Error("Places API request failed");
    }

    const data = await response.json();
    cafes = data.places || [];

    if (!cafes.length) {
      openState(false, true, "No cafes found nearby.");
      return;
    }

    statusText.textContent = `Found ${cafes.length} cafes near you.`;
    currentIndex = 0;
    showCurrentCafe();
  } catch (err) {
    console.error(err);
    openState(false, true, "Failed to load cafes. Please try again.");
  }
}

// ---------- UI: SHOW CURRENT CAFE ----------

function showCurrentCafe() {
  if (currentIndex >= cafes.length) {
    openState(false, true, "You’ve browsed all cafes in this search.");
    return;
  }

  const place = cafes[currentIndex];

  const name =
    (place.displayName && place.displayName.text) || "Unnamed Café";
  const address = place.formattedAddress || "Address not available";

  let category = "Café";
  if (place.types && place.types.length) {
    // take first type and make it pretty
    category = place.types[0].replace(/_/g, " ");
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }

  cafeNameEl.textContent = name;
  cafeAddressEl.textContent = address;
  cafeDistanceEl.textContent = "Near your location";
  cafeCategoryEl.textContent = category;

  const mapQuery = encodeURIComponent(address || name);
  mapLinkEl.href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  openState(true, false);
}

// ---------- LOCALSTORAGE HELPERS ----------

function getSavedCafes() {
  try {
    const raw = window.localStorage.getItem("savedCafes");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse saved cafes", e);
    return [];
  }
}

function saveCurrentCafe() {
  if (currentIndex >= cafes.length) return;

  const place = cafes[currentIndex];
  const saved = getSavedCafes();

  const id = place.id || place.name || null; // name is like "places/ChIJ..."
  const address = place.formattedAddress || "Address not available";
  const name =
    (place.displayName && place.displayName.text) || "Unnamed Café";

  let category = "Café";
  if (place.types && place.types.length) {
    category = place.types[0].replace(/_/g, " ");
    category = category.charAt(0).toUpperCase() + category.slice(1);
  }

  const alreadySaved = saved.some((c) => {
    if (id && c.id === id) return true;
    return c.name === name && c.address === address;
  });

  if (!alreadySaved) {
    saved.push({
      id,
      name,
      address,
      category
    });
    window.localStorage.setItem("savedCafes", JSON.stringify(saved));
  }

  currentIndex += 1;
  showCurrentCafe();
}

function skipCafe() {
  currentIndex += 1;
  showCurrentCafe();
}

// ---------- GEOLOCATION INIT ----------

function init() {
  if (!("geolocation" in navigator)) {
    openState(false, true, "Geolocation is not supported in this browser.");
    return;
  }

  statusText.textContent = "Requesting your location...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchCafes(latitude, longitude);
    },
    (err) => {
      console.error(err);
      openState(
        false,
        true,
        "Location access denied. Please allow it and refresh the page."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

// ---------- EVENT LISTENERS ----------
if (saveBtn && skipBtn && retryBtn) {
  saveBtn.addEventListener("click", saveCurrentCafe);
  skipBtn.addEventListener("click", skipCafe);
  retryBtn.addEventListener("click", () => {
    cafes = [];
    currentIndex = 0;
    init();
  });

  init();
}

