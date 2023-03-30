var cityinput = document.querySelector('#city');
var userinput = document.querySelector('#city-container');
var search = document.querySelector('#search');
var city;
var APIKey = "2fa299772ce8810c137aa45c20f5b624";
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

var formSubmitHandler = function (event) {
    event.preventDefault();
}

userinput.addEventListener('search', formSubmitHandler);