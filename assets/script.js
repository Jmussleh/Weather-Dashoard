  var searchH = [];
  var city = document.getElementById('search-input');
  var searchForm = document.getElementById('search-form');
  var Submit = document.getElementById('submit');
  var CurrentWeatherCon = document.getElementById('CurrentWeather');
  var forecastCon = document.getElementById('5Day');
  var searchHistoryCon = document.getElementById('city-history');
  var api_key = "2fa299772ce8810c137aa45c20f5b624";
  var baseURL = 'https://api.openweathermap.org';
  
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);

  function SearchHistory() {
    searchHistoryCon.innerHTML ='';
    for (var i = searchH.length - 1; i >= 0; i--) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      //btn.setAttribute('aria-controls', 'today forecast');
      btn.classList.add('history-btn', 'btn-history', 'btn-primary');
      btn.setAttribute('data-search', searchH[i]);
      btn.textContent = searchH[i];
      searchHistoryCon.append(btn);
    }
  }
  
  function Historyadd(search) {
    if (searchH.indexOf(search) !== -1) {
      return;
    }
    searchH.push(search);
  
    localStorage.setItem('searchhistory', JSON.stringify(searchH));
    SearchHistory();
  }
  
  function GetSearchHistory() {
    var storedHistory = localStorage.getItem('searchhistory');
    if (storedHistory) {
      searchH = JSON.parse(storedHistory);
    }
    SearchHistory();
  }
  
  function CurrentWeather(city, weather) {
    var date = dayjs().format('M/D/YYYY');

    var tempF = weather.main.temp;
    var windMph = weather.wind.speed;
    var humidity = weather.main.humidity;
  
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var temp = document.createElement('p');
    var wind = document.createElement('p');
    var humidity1 = document.createElement('p');
  
    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);
  
    heading.setAttribute('class', 'h3 card-title');
    temp.setAttribute('class', 'card-text');
    wind.setAttribute('class', 'card-text');
    humidity1.setAttribute('class', 'card-text');
  
    heading.textContent = `${city} (${date})`;
    temp.textContent = `Temp: ${tempF}°F`;
    wind.textContent = `Wind: ${windMph} MPH`;
    humidity1.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, temp, wind, humidity1);
  
    CurrentWeatherCon.innerHTML = '';
    CurrentWeatherCon.append(card);
  }
  
  function ForecastCard(forecast) {
  
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windMph = forecast.wind.speed;
  
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var temp = document.createElement('p');
    var wind = document.createElement('p');
    var humidityl = document.createElement('p');
  
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, temp, wind, humidityl);
  
    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    temp.setAttribute('class', 'card-text');
    wind.setAttribute('class', 'card-text');
    humidityl.setAttribute('class', 'card-text');
  
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    temp.textContent = `Temp: ${tempF} °F`;
    wind.textContent = `Wind: ${windMph} MPH`;
    humidityl.textContent = `Humidity: ${humidity} %`;
  
    forecastCon.append(col);
  }

  function Forecast(dailyWeather) {
   
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();
  
    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');
  
    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);
  
    forecastCon.innerHTML = '';
    forecastCon.append(headingCol);
  
    for (var i = 0; i < dailyWeather.length; i++) {
      
      if (dailyWeather[i].dt >= startDt && dailyWeather[i].dt < endDt) {
  
        if (dailyWeather[i].dt_txt.slice(11, 13) == "12") {
          ForecastCard(dailyWeather[i]);
        }
      }
    }
  }

  function Data(city, data) {
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
      Data(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function Coordinates(search) {
  var apiUrl = `${baseURL}/geo/1.0/direct?q=${search}&limit=5&appid=${api_key}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        Historyadd(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function handleSearchFormSubmit(e) {
    if (!city.value) {
      return;
    }
    e.preventDefault();
    var search = city.value;
    Coordinates(search);
  }
function handleSearchHistory(e) {
  if (!e.target.matches('.btn-history')) {
    return;
  }
  var btn = e.target;
  var search = btn.getAttribute('data-search');
  Coordinates(search);
}

GetSearchHistory();
Submit.addEventListener("click", handleSearchFormSubmit);
searchHistoryCon.addEventListener('click', handleSearchHistory);

 

  