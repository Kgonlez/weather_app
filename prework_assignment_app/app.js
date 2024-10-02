import {
  weatherConditions, //Object conatining weather codes and corresponding descriptions
  updateWeatherCondition, //Funcction to update the weather condition text based on weather code
  updateWeatherImage, // Function to update the weather image based on weather code 
  weatherImages, // Object mapping weather codes to weather condition images
} from "./weatherConditions.js";

/*------DOM Elements------ */
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

/*------Formatting dates & Time------ */

  //Function to display the local time for a given timezone
function displayLocalTime(timezone) {
  const currentUtcTime = new Date();

  //Format the time accoridng to the provided timezone
  const localTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  }).format(currentUtcTime);

  const localTimeElement = document.querySelector(".local-time-text");
  localTimeElement.textContent = `${localTime}`;
}
  //Function to format date as (e.g. 'Tue, Oct 1')
function formatDate(date) {
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
  //Function to format date as just weekday (e.g. 'Tue')
function formatDateShort(date) {
  const options = { weekday: "short" };
  return date.toLocaleDateString("en-US", options);
}

/*--------Retrieving Temperatures & modifiying temp display--------*/

let isFahrenheit = false;
let tempInCelsius = 0;
let forecastTempInCelsius = [];

function convertToFahrenheit(cel) {
  return (cel * 9) / 5 + 32;
}

//Function to update temperature to toggle between Celsius and Fahrenheit
function updateTempDisplay() {
  let displayedTemp;

  //Determine which unit to display (Celsius or Fahrenheit) on toggle button
  if (isFahrenheit) {
    displayedTemp = `${Math.round(convertToFahrenheit(tempInCelsius))} °F`;
    toggleUnitBtn.textContent = "Convert to °C";
  } else {
    displayedTemp = `${Math.round(tempInCelsius)} °C`;
    toggleUnitBtn.textContent = "Convert to °F";
  }
  tempText.innerHTML = displayedTemp; //Update temperature in DOM

  //Update temperature in the 7day forecast
  forecastTempInCelsius.forEach((temp, i) => {
    const maxTemp = isFahrenheit
      ? Math.round(convertToFahrenheit(temp.max)) //Convert max temp to Fahrenheit
      : Math.round(temp.max);
    const minTemp = isFahrenheit
      ? Math.round(convertToFahrenheit(temp.min)) //Convert min temp to Fahrenheit
      : Math.round(temp.min);

    //Find forecast element in DOM and update with new temperature values 
    const forecastTempElement = document.querySelector(
      `.forecast-item-temp-${i}`
    );

    if (forecastTempElement) {
      forecastTempElement.innerHTML = `H:${maxTemp}°${
        isFahrenheit ? "F" : "C"
      }  L:${minTemp}°${isFahrenheit ? "F" : "C"}`;
    }
  });
}

/*--------Using Geocode API as Open Mateo API accept coordinates and geocode Api helps convert city input names into coordinates needed for Open Mateo API--------*/
// Function to fetch weather data location by latitude and longitude

async function fetchWeatherData(city) {
  const geocodeApiKey = import.meta.env.VITE_GEOCODE_API_KEY; //Geocode API key from .env file
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geocodeApiKey}`;

  if (!geocodeApiKey) {
    alert("API key is missing.Please add your API key to the .env file.");
    return;
  }

  try {
    const geocodeResponse = await fetch(geocodeUrl); //Fetch geocoding data from API
    const geocodeData = await geocodeResponse.json(); 

    if (geocodeData.results.length === 0) {
      throw new Error("City not found");
    }

    //Extract city name and coordinates (latitude and longitude)
    const components = geocodeData.results[0].components;
    const cityName = components.city || components.town || components.village || city;
    const lat = geocodeData.results[0].geometry.lat;
    const lon = geocodeData.results[0].geometry.lng;

    // Fetch weather data from Open Meteo API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    //Update UI with weather data and forecast 
    updateWeatherInfo(weatherData, cityName, formattedDate);
    update7DayForecast(weatherData.daily);
  } catch (error) {
    showError(error); //SHow error message if city not found or API fails 
  }
}

/*------First end point to update the Current weather data------ */
  //Function to update the UI with the current weather data 
function updateWeatherInfo(weatherData, location, formattedDate) {
  const weather = weatherData.current_weather;

  updateWeatherCondition(weather.weathercode); //Update weather condition text
  updateWeatherImage(weather.weathercode); //Update weather icon based on the condition

  //Update text content with location and weather details 
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

  //Show weather information and hide other sections
  weatherInfoSection.style.display = "block";
  searchCitySection.style.display = "none";
  errorSection.style.display = "none";
}

/*------Second end point to update the 7 day weather data------ */
  //Function to update UI with 7-day weather forecast data 
function update7DayForecast(dailyData) {
  const forecastContainer = document.querySelector(".forecast-items-container");
  forecastContainer.innerHTML = ""; //Clear previous forecast items 

  //Store daily max/min temperatures and weather codes for each day in the forecast
  forecastTempInCelsius = dailyData.temperature_2m_max.map((maxTemp, i) => ({
    max: maxTemp,
    min: dailyData.temperature_2m_min[i],
    weatherCode: dailyData.weather_code[i],
  }));

  //Loop through each day's data and create forecast items 
  dailyData.time.forEach((date, i) => {
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");

    const forecastDate = formatDateShort(new Date(date));

    //Get min and max temperatures
    const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
    const minTemp = Math.round(dailyData.temperature_2m_min[i]);
    const weatherCode = dailyData.weather_code[i];
    const weatherCondition = weatherConditions[weatherCode] || "Unknown"; //Get weather condition text
    const weatherImageFile = weatherImages[weatherCode] || "clear.svg"; //Get corresponding weather icons
    const weatherImagePath = `assets/weather_img/${weatherImageFile}`; //Build path to the weather image

    //Create the HTML structure for the forecast item
    forecastItem.innerHTML = `
  <h5 class='forecast-item-date regular-text'>${forecastDate}</h5>
  <img src="${weatherImagePath}" alt="${weatherCondition}" class="forecast-item-img">
  <h5 class='forecast-item-condition regular-text'>${weatherCondition}</h5>
  <h5 class='forecast-item-temp forecast-item-temp-${i}'>H:${maxTemp}°C L:${minTemp}°C</h5>`;
    forecastContainer.appendChild(forecastItem);
  }); //Add the forecast item to the container
}

/*------ Errors, Event Listeners,Search------*/
//Toggle between Fahrenheit and Celsius when the toggle button us clicked
toggleUnitBtn.addEventListener("click", () => {
  isFahrenheit = !isFahrenheit; //Toggle the temp unit
  updateTempDisplay();
});

//Function to show an error message when something goes wrong (e.g. city not found)
function showError() {
  errorSection.style.display = "block";
  weatherInfoSection.style.display = "none";
  searchCitySection.style.display = "none";
}

//Handle the search operation when the search button is clikes or "Enter" key is pressed
function handleSearch() {
  const city = locationInput.value.trim();
  if (city !== "") {
    fetchWeatherData(city);
  }
}

//Add event listener to the search button to trigger search on click
searchBtn.addEventListener("click", handleSearch);

//Add event listener to trigger search when 'Enter' key is pressed in the inputt field
locationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});
