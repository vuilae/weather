const express = require("express");
const axios = require("axios");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "views")));

const handleWeatherGetRequest = (req, res) => {
  res.sendFile(path.join(__dirname, "views", "weather.html"));
};
const handleWeatherPostRequest = async (req, res) => {
  const city = req.body.city;
  const lat = req.body.lat;
  const lon = req.body.lng;

  try {
    let apiUrl;

    if (city) {
      // Case 1: City is specified in the request
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6dd090f4e8b95ec52fce0e141d021b67&units=metric`;
    } else {
      // Case 2: Coordinates are specified in the request
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6dd090f4e8b95ec52fce0e141d021b67&units=metric`;
    }

    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    const temperature = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const weatherIcon = weatherData.weather[0].icon;
    const description = weatherData.weather[0].description;
    const coordinates = `(${weatherData.coord.lat}, ${weatherData.coord.lon})`;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const windSpeed = weatherData.wind.speed;
    const countryCode = weatherData.sys.country;
    const rainVolume = weatherData.rain ? weatherData.rain["1h"] : "N/A";
    const cityName = weatherData.name;
    const country = weatherData.sys.country;

    const additionalContent = `
  <div class='results'>
    <div class="weather-container">
      <h2>Current Weather</h2>
      <h2>${cityName}, ${country}</h2>
      <p class="weather-info">Temperature: ${temperature} &deg;C</p>
      <p class="weather-info">Feels Like: ${feelsLike} &deg;C</p>
      <p class="weather-info">Description: ${description}</p>
      <p class="weather-info">Weather Icon: <img class="weather-icon" src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon"></p>
      <p class="weather-info">Coordinates: ${coordinates}</p>
      <p class="weather-info">Humidity: ${humidity}%</p>
      <p class="weather-info">Pressure: ${pressure} hPa</p>
      <p class="weather-info">Wind Speed: ${windSpeed} m/s</p>
      <p class="weather-info">Country Code: ${countryCode}</p>
      <p class="weather-info">Rain Volume (1h): ${rainVolume} mm</p>
    </div>
  </div>`;

    let existingHtml = fs.readFileSync(
      path.join(__dirname, "views", "weather.html"),
      "utf8"
    );

    existingHtml = existingHtml.replace(
      "</body>",
      `${additionalContent}</body>`
    );
    res.send(existingHtml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching weather data");
  }
}

const handleMovieGetRequest = (req, res) => {
  res.sendFile(path.join(__dirname, "views", "movie.html"));
};

const handleMoviePostRequest = async (req, res) => {
  const movieTitle = req.body.movieTitle;

  try {
    const omdbApiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(
      movieTitle
    )}&apikey=d0807667`;
    const omdbApiResponse = await axios.get(omdbApiUrl);
    const movieData = omdbApiResponse.data;

    const movieHtml = `
      <div class='movie-container'>
        <h2>${movieData.Title}</h2>
        <p>${movieData.Plot}</p>
        <img src="${movieData.Poster}" alt="${movieData.Title} Poster">
      </div>`;

    res.json({ movieHtml });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
};


const handleApodGetRequest = (req, res) => {
  res.sendFile(path.join(__dirname, "views", "nasa.html"));
};

const handleApodPostRequest = async (req, res) => {
  try {
    const apiKey = "1Pxo0Pvd4Jbtoq2eLp6mYLVXNfD2uJknX8RwjHcU"
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    const response = await axios.get(apiUrl);
    const apodData = response.data;

    res.json(apodData);
  } catch (error) {
    console.error("Error fetching APOD data:", error);
    res.status(500).send("Error fetching APOD data");
  }
};


app.get("/", handleWeatherGetRequest);
app.post("/weather", handleWeatherPostRequest);

app.get("/movie", handleMovieGetRequest);
app.post("/movie", handleMoviePostRequest);

app.get("/nasa", handleApodGetRequest);
app.post("/nasa", handleApodPostRequest);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
