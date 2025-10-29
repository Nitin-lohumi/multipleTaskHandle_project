import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

const weatherDescriptions: Record<number, string> = {
  0: "Clear sky ☀️",
  1: "Mainly clear 🌤️",
  2: "Partly cloudy ⛅",
  3: "Overcast ☁️",
  45: "Fog 🌫️",
  48: "Depositing rime fog 🌫️",
  51: "Light drizzle 🌦️",
  61: "Slight rain 🌧️",
  71: "Slight snow ❄️",
  95: "Thunderstorm ⛈️",
};

const WeatherNow: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Step 1: Get latitude & longitude
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found. Try again.");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather by coordinates
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData.current_weather);
      setLocation(`${name}, ${country}`);
    } catch (err: any) {
      setError("Failed to fetch weather. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDesc = (code: number) =>
    weatherDescriptions[code] || "Unknown";

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-4">🌦️ Weather Now</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <ClipLoader color="#2563eb" />
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weather && (
        <div className="mt-6 p-6 bg-blue-50 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800">{location}</h2>
          <p className="text-4xl font-bold mt-2">{weather.temperature}°C</p>
          <p className="text-gray-600 mt-1">
            {getWeatherDesc(weather.weathercode)}
          </p>
          <p className="text-gray-600 mt-1">
            💨 Wind: {weather.windspeed} km/h
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherNow;
