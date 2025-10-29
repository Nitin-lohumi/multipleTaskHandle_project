import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, CircularProgress } from "@mui/material";
interface WeatherModalProps {
  open: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  city: string;
}

interface DetailWeather {
  temperature: number;
  humidity: number;
  windspeed: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

const WeatherModal: React.FC<WeatherModalProps> = ({
  open,
  onClose,
  latitude,
  longitude,
  city,
}) => {
  const [details, setDetails] = useState<DetailWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto`
        );
        const data = await res.json();
        setDetails({
          temperature: data.current_weather.temperature,
          humidity: data.hourly?.relative_humidity_2m?.[0] || 60,
          windspeed: data.current_weather.windspeed,
          pressure: data.hourly?.surface_pressure?.[0] || 1010,
          sunrise: data.daily?.sunrise?.[0],
          sunset: data.daily?.sunset?.[0],
        });
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [latitude, longitude, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          width: 400,
          mx: "auto",
          mt: "10%",
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          🌦️ Weather Details — {city}
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : details ? (
          <>
            <Typography>🌡️ Temperature: {details.temperature}°C</Typography>
            <Typography>💨 Wind Speed: {details.windspeed} km/h</Typography>
            <Typography>💧 Humidity: {details.humidity}%</Typography>
            <Typography>🧭 Pressure: {details.pressure} hPa</Typography>
            <Typography>🌅 Sunrise: {new Date(details.sunrise).toLocaleTimeString()}</Typography>
            <Typography>🌇 Sunset: {new Date(details.sunset).toLocaleTimeString()}</Typography>
          </>
        ) : (
          <Typography color="error">No data available.</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default WeatherModal;
