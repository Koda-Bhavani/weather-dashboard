
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const statusMessage = document.getElementById("status");
const result = document.getElementById("weather-result");

const cityName = document.getElementById("city-name");
const description = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const updatedTime = document.getElementById("updated-time");

const weatherDescriptions = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    48: "Depositing rime fog 🌫️",
    51: "Light drizzle 🌦️",
    53: "Moderate drizzle 🌦️",
    55: "Dense drizzle 🌧️",
    61: "Slight rain 🌧️",
    63: "Moderate rain 🌧️",
    65: "Heavy rain 🌧️",
    71: "Slight snowfall 🌨️",
    73: "Moderate snowfall 🌨️",
    75: "Heavy snowfall ❄️",
    80: "Rain showers 🌦️",
    81: "Moderate rain showers 🌧️",
    82: "Violent rain showers ⛈️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm with hail ⛈️",
    99: "Thunderstorm with heavy hail ⛈️"
};

async function getWeather(city) {
    statusMessage.textContent = "Loading weather...";
    result.hidden = true;

    try {
        // Find city coordinates using Open-Meteo Geocoding API
        const geoUrl =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) +
            "&count=1&language=en&format=json";

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please check the spelling.");
        }

        const place = geoData.results[0];

        // Fetch current weather using the city's coordinates
        const weatherUrl =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            place.latitude +
            "&longitude=" +
            place.longitude +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto";

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        if (!current) {
            throw new Error("Current weather data is unavailable.");
        }

        cityName.textContent =
            place.name +
            (place.admin1 ? ", " + place.admin1 : "") +
            (place.country ? ", " + place.country : "");

        description.textContent =
            weatherDescriptions[current.weather_code] ||
            "Weather conditions unavailable";

        temperature.textContent =
            `${current.temperature_2m} °C`;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        updatedTime.textContent =
            "Last updated: " +
            current.time.replace("T", " ") +
            " (local time)";

        result.hidden = false;
        statusMessage.textContent = "Weather loaded successfully!";
    } catch (error) {
        statusMessage.textContent = error.message ||
            "Something went wrong. Please try again.";
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = input.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a city name.";
        return;
    }

    await getWeather(city);
});
