  var searchH = [];
  var city = document.getElementById('#search-input');
  var searchForm = document.getElementById('#search-form');
  var Submit = document.getElementById('#submit');
  var CurrentWeatherCon = document.getElementById('#CurrentWeather');
  var forecastCon = document.getElementById('#5day');
  var searchHistoryCon = document.getElementById('#city-history');
  var api_key = "2fa299772ce8810c137aa45c20f5b624";
  var baseURL = 'https://api.openweathermap.org';
  
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);

  function SearchHistory() {
    //searchHistoryCon.innerHTML ='';
    for (var i = searchH.length - 1; i >= 0; i--) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-controls', 'today forecast');
      btn.classList.add('history-btn', 'btn-history');
      btn.setAttribute('data-search', searchHistory[i]);
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
      searchHistory = JSON.parse(storedHistory);
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
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
  
    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);
  
    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
  
    heading.textContent = `${city} (${date})`;
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);
  
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
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
  
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, tempEl, windEl, humidityEl);
  
    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
  
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
  
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
  
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  
    for (var i = 0; i < dailyWeather.length; i++) {
  
      
      if (dailyWeather[i].dt >= startDt && dailyWeather[i].dt < endDt) {
  
        
        if (dailyWeather[i].dt_txt.slice(11, 13) == "12") {
          ForecastCard(dailyWeather[i]);
        }
      }
    }
  }

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
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function handleSearchFormSubmit(e) {
  
  if (!searchInput.value) {
    return;
  }

  e.preventDefault();
  var search = searchInput.value.trim();
  Coordinates(search);
  searchInput.value = '';
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
searchForm.addEventListener('Submit', handleSearchFormSubmit);
searchHistoryCon.addEventListener('click', handleSearchHistory);

 

  