import {
  weatherConditions,
  updateWeatherCondition,
  updateWeatherImage,
  weatherImages,
} from "./weatherConditions.js";

// Global State Variables
let isFahrenheit = false;
let tempInCelsius = 0;
let forecastTempInCelsius = [];

/**
 * Displays the local time for a given timezone
 */
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

/**
 * Formats dates for display (e.g. 'Tue, Oct 1')
 *
 * @param {Date} date - The date object to format.
 * @param {boolean} short - Whether to display the date in short format (e.g. 'Tue').
 */
function formatDate(date, short = false) {
  const options = short
    ? { weekday: "short" }
    : { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function convertToFahrenheit(cel) {
  return (cel * 9) / 5 + 32;
}

/**
 * Updates DOM to toggle between Celsius and Fahrenheit
 *
 * @param {number} tempInCelsius - The temperature in Celsius.
 * @param {boolean} isFahrenheit - Whether the temperature is in Fahrenheit.
 */
function updateTempDisplay(tempInCelsius, isFahrenheit) {
  let displayedTemp;
  const tempText = document.querySelector(".temp-text");

  if (isFahrenheit) {
    displayedTemp = `${Math.round(convertToFahrenheit(tempInCelsius))} °F`;
    toggleUnitBtn.textContent = "Convert to °C";
  } else {
    displayedTemp = `${Math.round(tempInCelsius)} °C`;
    toggleUnitBtn.textContent = "Convert to °F";
  }
  tempText.innerHTML = displayedTemp;

  // Update temperature in the 7 day forecast
  forecastTempInCelsius.forEach((temp, i) => {
    const maxTemp = Math.round(
      isFahrenheit ? convertToFahrenheit(temp.max) : temp.max
    );
    const minTemp = Math.round(
      isFahrenheit ? convertToFahrenheit(temp.min) : temp.min
    );

    const forecastTempElement = document.querySelector(
      `.forecast-item-temp-${i}`
    );
    if (forecastTempElement) {
      let unit = isFahrenheit ? "F" : "C";
      forecastTempElement.innerHTML = `H:${maxTemp}°${unit} L:${minTemp}°${unit}`;
    }
  });
}

/**
 * Fetches weather data location by latitude and longitude.
 *
 * The Open Meteo API accepts coordinates and geocode API helps convert city input names into coordinates needed for Open Meteo API.
 *
 * @param {string} city - The city name to fetch weather data for.
 * @returns {Promise<void>} - A promise that resolves when the weather data is fetched.
 */
async function fetchWeatherData(city) {
  const geocodeApiKey = import.meta.env.VITE_GEOCODE_API_KEY;
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geocodeApiKey}`;

  if (!geocodeApiKey) {
    alert("API key is missing. Please add your API key to the .env file.");
    return;
  }

  try {
    const geocodeData = await fetch(geocodeUrl).then((response) =>
      response.json()
    );

    if (geocodeData.results.length === 0) {
      throw new Error("City not found");
    }

    // Extract city name and coordinates (latitude and longitude) from the geocode API response
    const components = geocodeData.results[0].components;
    const cityName =
      components.city || components.town || components.village || city;
    const lat = geocodeData.results[0].geometry.lat;
    const lon = geocodeData.results[0].geometry.lng;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    const weatherData = await fetch(weatherUrl).then((response) =>
      response.json()
    );
    const formattedDate = formatDate(new Date());

    updateWeatherInfo(weatherData, cityName, formattedDate);
    update7DayForecast(weatherData.daily);
  } catch (error) {
    showError(error);
  }
}

/**
 * Function to update the UI with the current weather data
 *
 * @param {object} weatherData - The weather data object returned by the Open Meteo API.
 * @param {string} location - The location name.
 * @param {string} formattedDate - The formatted date string.
 */
function updateWeatherInfo(weatherData, location, formattedDate) {
  const weather = weatherData.current_weather;
  updateWeatherCondition(weather.weathercode);
  updateWeatherImage(weather.weathercode);

  const locationText = document.querySelector(".location-text");
  const conditionText = document.querySelector(".condition-text");
  const windSpeedText = document.querySelector(".wind-value-text");

  locationText.textContent = location;
  conditionText.textContent = weather.weathercode === 0 ? "Clear" : "Clouds";
  const windSpeedInMph = Math.round(weather.windspeed * 0.621371);
  windSpeedText.textContent = `${windSpeedInMph} mph`;

  displayLocalTime(weatherData.timezone);

  tempInCelsius = weather.temperature;
  updateTempDisplay(tempInCelsius, isFahrenheit);

  const currentDateText = document.querySelector(".current-date-text");
  const weatherInfoSection = document.querySelector(".weather-info");
  const searchCitySection = document.querySelector(".landing-page");
  const errorSection = document.querySelector(".error-404");

  currentDateText.textContent = formattedDate;
  weatherInfoSection.style.display = "block";
  searchCitySection.style.display = "none";
  errorSection.style.display = "none";
  locationInput.value = "";
}

/**
 * Updates UI with 7-day weather forecast data
 *
 * @param {object} dailyData - The daily data object returned by the Open Meteo API.
 */
function update7DayForecast(dailyData) {
  const forecastContainer = document.querySelector(
    ".sevenday-forecast-container"
  );
  forecastContainer.innerHTML = "";

  // Store daily max/min temperatures and weather codes for each day in the forecast
  forecastTempInCelsius = dailyData.temperature_2m_max.map((maxTemp, i) => ({
    max: maxTemp,
    min: dailyData.temperature_2m_min[i],
    weatherCode: dailyData.weather_code[i],
  }));

  dailyData.time.forEach((date, i) => {
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");

    const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
    const minTemp = Math.round(dailyData.temperature_2m_min[i]);
    const weatherCode = dailyData.weather_code[i];

    forecastItem.innerHTML = generateForecastItemHTML(
      date,
      maxTemp,
      minTemp,
      weatherCode,
      i
    );
    forecastContainer.appendChild(forecastItem);
  });
}

/**
 * Generates HTML for a single forecast item
 *
 * @param {string} date - The date of the forecast item.
 * @param {number} maxTemp - The maximum temperature for the forecast item.
 * @param {number} minTemp - The minimum temperature for the forecast item.
 * @param {number} weatherCode - The weather code for the forecast item.
 */
function generateForecastItemHTML(date, maxTemp, minTemp, weatherCode, i) {
  const weatherCondition = weatherConditions[weatherCode] || "rain";
  const weatherImageFile = weatherImages[weatherCode] || "clear.svg";
  const weatherImagePath = `assets/weather_img/${weatherImageFile}`;

  const forecastDate = formatDate(new Date(date), true);

  return `
  <h5 class='forecast-item-date regular-text'>${forecastDate}</h5>
  <img src="${weatherImagePath}" alt="${weatherCondition}" class="forecast-item-img">
  <h5 class='forecast-item-condition regular-text'>${weatherCondition}</h5>
  <h5 class='forecast-item-temp forecast-item-temp-${i}'>H:${maxTemp}°C L:${minTemp}°C</h5>`;
}

const toggleUnitBtn = document.getElementById("toggle-unit-btn");
/**
 * Toggles between Fahrenheit and Celsius when the toggle button us clicked
 */
toggleUnitBtn.addEventListener("click", () => {
  isFahrenheit = !isFahrenheit;
  updateTempDisplay(tempInCelsius, isFahrenheit);
});

/**
 * Shows an error message when something goes wrong (e.g. city not found)
 */
function showError(error) {
  console.error(error);

  const errorSection = document.querySelector(".error-404");
  const weatherInfoSection = document.querySelector(".weather-info");
  const searchCitySection = document.querySelector(".landing-page");

  errorSection.style.display = "block";
  weatherInfoSection.style.display = "none";
  searchCitySection.style.display = "none";
}

const searchBtn = document.querySelector(".search-btn");
/**
 * Handles searching when the search button is clicked
 */
searchBtn.addEventListener("click", () => {
  handleSearch();
});

const locationInput = document.querySelector(".location-input");

function handleSearch() {
  const city = locationInput.value.trim();
  if (city !== "") {
    fetchWeatherData(city);
  }
}

/**
 * Handles searching when the 'Enter' key is pressed in the input field
 */
locationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});
