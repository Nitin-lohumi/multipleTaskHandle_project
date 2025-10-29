import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import WeatherModal from "./WeatherModal";

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
  61: "Rain 🌧️",
  71: "Snow ❄️",
  95: "Thunderstorm ⛈️",
};

const WeatherNow: React.FC = () => {
  const [city, setCity] = useState("delhi");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<{
    name: string;
    country: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
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
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData.current_weather);
      setLocation({ name, country, lat: latitude, lon: longitude });
    } catch {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
  }, []);
  const getDesc = (code: number) => weatherDescriptions[code] || "Unknown";

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
        <div className="flex justify-center">
          <ClipLoader color="#2563eb" />
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weather && location && (
        <div className="mt-6 p-6 bg-blue-50 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.name}, {location.country}
          </h2>
          <p className="text-4xl font-bold mt-2">{weather.temperature}°C</p>
          <p className="text-gray-600 mt-1">{getDesc(weather.weathercode)}</p>
          <p className="text-gray-600 mt-1">
            💨 Wind: {weather.windspeed} km/h
          </p>

          <button
            onClick={() => setOpenModal(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            More Details
          </button>
        </div>
      )}

      {openModal && location && (
        <WeatherModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          latitude={location.lat}
          longitude={location.lon}
          city={location.name}
        />
      )}
    </div>
  );
};

export default WeatherNow;
