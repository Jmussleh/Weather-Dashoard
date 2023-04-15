/*function getWeatherData(location) {
    const apiKey = "2fa299772ce8810c137aa45c20f5b624";
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    return fetch(api)
      .then(response => response.json())
      .then(data => {
        const weatherData = {
          temperature: data.main.temp,
          condition: data.weather[0].main,
          location: data.name,
        };
        return weatherData;
      });
  }*/
  var SearchH = [];
  var city = document.getElementById('#citySearch');
  var submit = document.getElementById('#search');
  var CurrentWeatherCon = document.getElementById('#CurrentWeather');
  var ForecastCon = document.getElementById('#5day');
  var SearchHistoryCon = document.getElementById('#city-container');
  var api_key = "2fa299772ce8810c137aa45c20f5b624";
  var baseURL = 'https://api.openweathermap.org';
  
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);


  function renderData(city, data) {
    CurrentWeather(city, data.list[0], data.city.timezone);
    Forecast(data.list);
  }
  function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var apiUrl = `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${api_key}`;
    
    fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderData(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}


  //Make whatever data runs through above function run through again with the lat/lon to get weather data.

  