var Search = $('#search');
var City = $('#citySearch');

function getWeatherData(location) {
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
  }

  function updateUI(weatherData) {
    var weatherCard = $("#citycontainer");
    var temperature = $("<p>");
    temperature.textContent = `${weatherData.temperature}°C`;
    var condition = $("<p>");
    condition.textContent = weatherData.condition;
    var location = $("#<p>");
    location.textContent = weatherData.location;
  }

Search.addEventListener("click", () => {
  const location = City.value;
  getWeatherData(location)
    .then(weatherData => {
      updateUI(weatherData);
    })
    .catch(error => {
      console.log(error);
    });
});