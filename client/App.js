client(app.js);
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); 

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Listen for weather updates from the server
    socket.on('weatherUpdate', (data) => {
      setWeatherData(data);
    });

    return () => {
      // Clean up socket connection on unmount
      socket.disconnect();
    };
  }, []);

  const handleWeatherRequest = () => {
    socket.emit('weatherRequest', city);
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={handleWeatherRequest}>Get Weather</button>

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].main}</p>
        </div>
      )}
    </div>
  );
};