/**
 * Maps weather codes to weather condition descriptions
 */
const weatherConditions = {
  0: "Clear",
  1: "Clear",
  2: "Cloudy",
  3: "Cloudy",
  45: "Fog",
  48: "Fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  61: "Rain",
  63: "Rain",
  65: "Rain",
  71: "Snowfall",
  73: "Snowfall",
  75: "Snowfall",
  95: "Thunder",
  96: "Thunder ",
};

/**
 * Updates the displayed weather condition text in UI based on weather code
 */
function updateWeatherCondition(weatherCode) {
  const conditionText = document.querySelector(".condition-text");
  conditionText.textContent = weatherConditions[weatherCode] || "Unknown";
}

/**
 * Maps weather codes to weather icon filenames in assets/weather_img dir
 */
const weatherImages = {
  0: "clear.svg",
  1: "clear.svg",
  2: "clouds.svg",
  3: "overcast.svg",
  45: "fog.svg",
  48: "fog.svg",
  51: "drizzle.svg",
  53: "drizzle.svg",
  55: "drizzle.svg",
  61: "rain.svg",
  63: "rain.svg",
  65: "rain.svg",
  71: "snow.svg",
  73: "snow.svg",
  75: "snow.svg",
  80: "rain.svg",
  81: "rain.svg",
  82: "rain.svg",
  95: "thunderstorm.svg",
  96: "thunderstorm.svg",
};

/**
 * Updates the weather image displayed in UI based on weather code
 */
function updateWeatherImage(weatherCode) {
  const weatherImage = document.querySelector(".current-weather-img");
  const imageFile = weatherImages[weatherCode] || "clear.svg";
  weatherImage.src = `assets/weather_img/${imageFile}`;
}

export {
  updateWeatherCondition,
  updateWeatherImage,
  weatherConditions,
  weatherImages,
};
