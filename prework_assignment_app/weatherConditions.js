const weatherConditions = {
  0: "Clear",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  71: "Slight Snowfall",
  73: "Moderate Snowfall",
  75: "Heavy Snowfall",
  95: "Thunderstorm",
  96: "Thunderstorm ",
};

function updateWeatherCondition(weatherCode) {
  const conditionText = document.querySelector(".condition-text");
  conditionText.textContent = weatherConditions[weatherCode] || "Unknown";
}

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

function updateWeatherImage(weatherCode) {
  const weatherImage = document.querySelector(".weather-summary-img");
  const imageFile = weatherImages[weatherCode] || "clear.svg";
  weatherImage.src = `assets/weather_img/${imageFile}`;
}

export { updateWeatherCondition, updateWeatherImage, weatherConditions, weatherImages };
