//Mapping of weather codes to corresponding weather condition descriptions
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
  95: "Thunderstorm",
  96: "Thunderstorm ",
};

//Function to update the displayed weather condition text in UI based on weather code
function updateWeatherCondition(weatherCode) {
  const conditionText = document.querySelector(".condition-text");
  conditionText.textContent = weatherConditions[weatherCode] || "Unknown"; //Default unknown if the code isn't on the list
}

//Mapping of weather codes to correspond weather icon filenames in assets/weather_img
const weatherImages = {
  0: "clear.svg",
  1: "clear.svg",
  2: "clouds.svg",
  3: "clouds.svg",
  45: "atmosphere.svg",
  48: "atmosphere.svg",
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

//Function to update the displayed weather image in UI based on weather code
function updateWeatherImage(weatherCode) {
  const weatherImage = document.querySelector(".weather-summary-img");
  const imageFile = weatherImages[weatherCode] || "clear.svg"; // Get the appropriate image file based on the weather code, defaulting to "clear.svg" if the code isn't in the list
  weatherImage.src = `assets/weather_img/${imageFile}`; //Update the src attribute of the weather image to point to the correct file path
}

export {
  updateWeatherCondition,
  updateWeatherImage,
  weatherConditions,
  weatherImages,
};
