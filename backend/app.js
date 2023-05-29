require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const API_KEY = process.env.OPENWEATHER_API_KEY; 
console.log(API_KEY, 'apikey')
// Fetch weather data from API
const getWeatherData = async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };
  
  // Socket.IO connection
  io.on('connection', (socket) => {
    console.log('New client connected.');
  
    socket.on('disconnect', () => {
      console.log('Client disconnected.');
    });
  
    // Handle weather request from client
    socket.on('weatherRequest', async (city) => {
      console.log(`Weather request received for ${city}`);
      const weatherData = await getWeatherData(city);
      socket.emit('weatherUpdate', weatherData);
    });
  });
  
  const port = 3001;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });