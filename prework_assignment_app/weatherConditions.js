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

export {
  updateWeatherCondition,
  updateWeatherImage,
  weatherConditions,
  weatherImages,
};
