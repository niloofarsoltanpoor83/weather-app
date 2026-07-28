console.log("Script Loaded!");

const API_KEY = "c7246f4ed11c174296162dff32c97872";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherResult = document.getElementById("weatherResult");
const updateTime = document.getElementById("updateTime");
const body = document.body;

searchBtn.addEventListener("click", getWeather);

locationBtn.addEventListener("click", getLocationWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        weatherResult.innerHTML = "<h2>Please enter a city.</h2>";
        return;
    }

    weatherResult.innerHTML = "<h2>Loading...</h2>";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);
        fetchForecast(city);
    } catch (error) {

        console.log(error);

        weatherResult.innerHTML =
            "<h2>City not found.</h2>";

    }

}
async function fetchForecast(city){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        if(!response.ok){

            throw new Error("Forecast not found");

        }

        const data = await response.json();

        displayForecast(data);

    }catch(error){

        console.log(error);

    }

}
function displayForecast(data) {

    const forecastContainer = document.getElementById("forecast");

    forecastContainer.innerHTML = "";

    const dailyForecast = [];

    data.list.forEach(item => {

        if (item.dt_txt.includes("12:00:00")) {

            dailyForecast.push(item);

        }

    });

    dailyForecast.forEach(day => {

        const date = new Date(day.dt_txt);

      const weekDay = date.toLocaleDateString("en-US", {
    weekday: "long"
});

const monthDay = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short"
});
        const icon = day.weather[0].icon;

        const iconUrl =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const rainChance=
            Math.round((day.pop || 0)*100);
        forecastContainer.innerHTML += `

            <div class="forecast-card">

                <h4>${weekDay}</h4>
                <P class="forecast-date">$
                {monthDay}</p>
                <img src="${iconUrl}" alt="Weather Icon">

                <p>${Math.round(day.main.temp)} °C</p>

                <p>${day.weather[0].description}</p>
                 <p>${rainChance}%</p>
            </div>

        `;

    });

}
function getLocationWeather() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(
        showPosition,
        showError
    );

}

async function showPosition(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        displayWeather(data);
       fetchForecast(data.name);
    } catch (error) {

        console.log(error);

        weatherResult.innerHTML =
            "<h2>Something went wrong!</h2>";

    }

}

function showError(error) {

    alert("Unable to get your location.");

}
function getLocationWeather(){

    if(navigator.geolocation){

        console.log("Location button clicked");

        navigator.geolocation.getCurrentPosition(showPosition, showError);

    }else{

        alert("Geolocation is not supported by this browser.");

    }

}


async function getWeatherByLocation(lat, lon){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        document.getElementById("weatherResult").innerHTML = `
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

            <div class="weather-info">

                <div class="card">
                    <h4>🌡️ Temperature</h4>
                    <p>${data.main.temp} °C</p>
                </div>

                <div class="card">
                    <h4>💧 Humidity</h4>
                    <p>${data.main.humidity}%</p>
                </div>

                <div class="card">
                    <h4>💨 Wind</h4>
                    <p>${data.wind.speed} m/s</p>
                </div>

            </div>
        `;

        showWeatherAnimation(data.weather[0].main);

    }catch(error){

        console.log("THIS CATCH RUN:",error);

        document.getElementById("weatherResult").innerHTML =
        "<h2>Something went wrong!</h2>";

    }

}


function showError(error){

    alert("Unable to get your location.");

}
function displayWeather(data) {

    const weather = data.weather[0].main;
    const icon = data.weather[0].icon;

    const iconUrl =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    changeBackground(weather);

    showWeatherAnimation(weather);

    const now = new Date();

    updateTime.innerHTML =
        "Updated: " +
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    weatherResult.innerHTML = `

        <h2>${data.name}</h2>

        <img src="${iconUrl}" alt="Weather Icon">

        <div class="weather-info">

            <div class="card">
                <h4>🌡️ Temperature</h4>
                <p>${Math.round(data.main.temp)} °C</p>
            </div>

            <div class="card">
                <h4>🤗 Feels Like</h4>
                <p>${Math.round(data.main.feels_like)} °C</p>
            </div>

            <div class="card">
                <h4>💧 Humidity</h4>
                <p>${data.main.humidity}%</p>
            </div>

            <div class="card">
                <h4>💨 Wind</h4>
                <p>${data.wind.speed} m/s</p>
            </div>

            <div class="card">
                <h4>🌡️ Min Temp</h4>
                <p>${Math.round(data.main.temp_min)} °C</p>
            </div>

            <div class="card">
                <h4>📈 Max Temp</h4>
                <p>${Math.round(data.main.temp_max)} °C</p>
            </div>

        </div>

    `;

}

function changeBackground(weather) {

    body.className = "";

    if (weather === "Clear") {

        body.classList.add("sunny");

    }

    else if (weather === "Clouds") {

        body.classList.add("cloudy");

    }

    else if (

        weather === "Rain" ||
        weather === "Drizzle" ||
        weather === "Thunderstorm"

    ) {

        body.classList.add("rainy");

    }

    else if (weather === "Snow") {

        body.classList.add("snowy");

    }

    else {

        body.classList.add("default");

    }

}
function showWeatherAnimation(weather) {

    const animation = document.getElementById("weatherAnimation");

    animation.innerHTML = "";

    if (weather === "Clear") {

        animation.innerHTML = `
            <div class="sun"></div>
        `;

    }

    else if (weather === "Clouds") {

        animation.innerHTML = `
            <div class="cloud"></div>
        `;

    }

    else if (
        weather === "Rain" ||
        weather === "Drizzle" ||
        weather === "Thunderstorm"
    ) {

        for (let i = 0; i < 120; i++) {

            const drop = document.createElement("div");

            drop.className = "drop";

            drop.style.left = Math.random() * window.innerWidth + "px";

            drop.style.animationDelay = Math.random() * 2 + "s";

            drop.style.animationDuration =
                (0.6 + Math.random() * 0.5) + "s";

            animation.appendChild(drop);

        }

    }

    else if (weather === "Snow") {

        for (let i = 0; i < 80; i++) {

            const snow = document.createElement("div");

            snow.innerHTML = "❄";

            snow.style.position = "absolute";

            snow.style.left = Math.random() * window.innerWidth + "px";

            snow.style.top = "-20px";

            snow.style.fontSize =
                (10 + Math.random() * 15) + "px";

            snow.style.opacity = Math.random();

            snow.style.animation = `snowFall ${4 + Math.random() * 4}s linear infinite`;

            snow.style.animationDelay =
                Math.random() * 4 + "s";

            animation.appendChild(snow);

        }

    }

}
 async function showPosition(position){

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    const weather = data.weather[0].main;

    showWeatherAnimation(weather);

    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("weatherResult").innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="Weather Icon">

        <div class="weather-info">

            <div class="card">
                <h4>🌡️ Temperature</h4>
                <p>${data.main.temp} °C</p>
            </div>

            <div class="card">
                <h4>💧 Humidity</h4>
                <p>${data.main.humidity}%</p>
            </div>

            <div class="card">
                <h4>💨 Wind</h4>
                <p>${data.wind.speed} m/s</p>
            </div>

        </div>
    `;

}
