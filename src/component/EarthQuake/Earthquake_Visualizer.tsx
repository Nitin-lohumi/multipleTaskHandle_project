import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Typography, CircularProgress } from "@mui/material";

interface Earthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

const EarthquakeVisualizer: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const center: LatLngExpression = [20, 0]; // ✅ Correctly typed

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        if (!res.ok) throw new Error("Failed to fetch earthquake data");
        const data = await res.json();
        setEarthquakes(data.features);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakes();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="border">
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 1, mb: 2, fontWeight: "bold", color: "#1565c0" }}
      >
        🌎 Earthquake Visualizer
      </Typography>

      <MapContainer
        center={center as L.LatLngExpression}
        zoom={2}
        style={{ height: "60vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {earthquakes.map((quake) => {
          const [lon, lat] = quake.geometry.coordinates;
          const mag = quake.properties.mag;
          return (
            <CircleMarker
              key={quake.id}
              center={[lat, lon]}
              radius={mag * 2 || 2}
              fillColor={mag >= 5 ? "red" : mag >= 3 ? "orange" : "yellow"}
              fillOpacity={0.8}
              stroke={false}
            >
              <Popup>
                <div>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {quake.properties.place || "Unknown location"}
                  </Typography>
                  <Typography>Magnitude: {mag}</Typography>
                  <Typography>
                    Time:{" "}
                    {new Date(quake.properties.time).toLocaleString("en-IN")}
                  </Typography>
                  <a
                    href={quake.properties.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    More Info
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EarthquakeVisualizer;
