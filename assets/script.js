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
  var city = document.getElementById('#citySearch');
  var submit = document.getElementById('#search');
  var api_key = "2fa299772ce8810c137aa45c20f5b624";
  var baseURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${api_key}`;
  fetch(baseURL, {cache: 'reload'})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
  