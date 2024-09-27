import {
  updateWeatherCondition,
  updateWeatherImage,
} from "./weatherConditions.js";

const searchBtn = document.querySelector(".search-btn");
const locationInput = document.querySelector(".location-input");
const weatherInfoSection = document.querySelector(".weather-info");
const errorSection = document.querySelector(".error-404");
const searchCitySection = document.querySelector(".search-city");

const countryText = document.querySelector(".country-text");
const tempText = document.querySelector(".temp-text");
const conditionText = document.querySelector(".condition-text");
const windSpeedText = document.querySelector(".wind-value-text");
const toggleUnitBtn = document.getElementById("toggle-unit-btn");

function formatDate(date) {
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

let isFahrenheit = false;
let tempInCelsius = 0;

function convertToFahrenheit(cel) {
  return (cel * 9) / 5 + 32;
}

function updateTempDisplay() {
  let displayedTemp;

  if (isFahrenheit) {
    displayedTemp = `${Math.round(convertToFahrenheit(tempInCelsius))} °F`;
    toggleUnitBtn.textContent = "To °C";
  } else {
    displayedTemp = `${Math.round(tempInCelsius)} °C`;
    toggleUnitBtn.textContent = "To °F";
  }

  tempText.innerHTML = displayedTemp;
}

function displayLocalTime(timezone) {
  const currentUtcTime = new Date();

  const localTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  }).format(currentUtcTime);

  const localTimeElement = document.querySelector(".local-time-text");
  localTimeElement.textContent = `${localTime}`;
}

/*Using Geocode API as Open Mateo API accept coordinates and geocode Api helps convert city input names into coordinates needed for Open Mateo API*/
// Function to fetch weather data location by latitude and longitude

async function fetchWeatherData(city) {
  const geocodeApiKey = import.meta.env.VITE_GEOCODE_API_KEY;
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geocodeApiKey}`;

  try {
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.results.length === 0) {
      throw new Error("City not found");
    }

    const components = geocodeData.results[0].components;
    const cityName =
      components.city || components.town || components.village || city;

    const lat = geocodeData.results[0].geometry.lat;
    const lon = geocodeData.results[0].geometry.lng;

    // Fetch weather data from Open Meteo API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    updateWeatherInfo(weatherData, cityName, formattedDate);
  } catch (error) {
    showError();
  }
}

// Function to update the weather info on the page
function updateWeatherInfo(weatherData, location, formattedDate) {
  const weather = weatherData.current_weather;

  updateWeatherCondition(weather.weathercode);
  updateWeatherImage(weather.weathercode);

  countryText.textContent = location;
  conditionText.textContent = weather.weathercode === 0 ? "Clear" : "Clouds";

  const windSpeedInMph = Math.round(weather.windspeed * 0.621371);
  windSpeedText.textContent = `${windSpeedInMph} mph`;

  const timezone = weatherData.timezone;
  displayLocalTime(timezone);

  tempInCelsius = weather.temperature;
  updateTempDisplay();

  const currentDateText = document.querySelector(".current-date-text");
  currentDateText.textContent = formattedDate;

  weatherInfoSection.style.display = "block";
  searchCitySection.style.display = "none";
  errorSection.style.display = "none";
}

toggleUnitBtn.addEventListener("click", () => {
  isFahrenheit = !isFahrenheit;
  updateTempDisplay();
});

function showError() {
  errorSection.style.display = "block";
  weatherInfoSection.style.display = "none";
  searchCitySection.style.display = "none";
}

function handleSearch() {
  const city = locationInput.value.trim();
  if (city !== "") {
    fetchWeatherData(city);
  }
}

searchBtn.addEventListener("click", handleSearch);

locationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});
