console.log("Scriptloaded");
const API_KEY = "c7246f4ed11c174296162dff32c97872";

document.getElementById("searchBtn").addEventListener("click", getWeather);

document.getElementById("locationBtn").addEventListener("click", getLocationWeather);

document.getElementById("cityInput").addEventListener("keydown", function(event) {

    console.log("Key:", event.key);

    if (event.key === "Enter") {
        event.preventDefault();
        console.log("Enter detected");
        getWeather();
    }

});
async function getWeather() {

    try {

        const city = document.getElementById("cityInput").value.trim();

        if (city === "") {
            alert("Please enter a city name.");
            return;
        }

        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.cod == "404") {

            document.getElementById("weatherResult").innerHTML =
            "<h2>City not found!</h2>";

            return;
        }

        const weather = data.weather[0].main;

        showWeatherAnimation(weather);

        const body = document.body;

        body.className = "";

        if (weather === "Clear") {
            body.classList.add("sunny");
        }
        else if (weather === "Clouds") {
            body.classList.add("cloudy");
        }
        else if (weather === "Rain" || weather === "Drizzle") {
            body.classList.add("rainy");
        }
        else if (weather === "Snow") {
            body.classList.add("snowy");
        }
        else {
            body.classList.add("default");
        }

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
                    <h4>🤗 Feels Like</h4>
                    <p>${data.main.feels_like} °C</p>
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
                    <h4>📉 Min</h4>
                    <p>${data.main.temp_min} °C</p>
                </div>

                <div class="card">
                    <h4>📈 Max</h4>
                    <p>${data.main.temp_max} °C</p>
                </div>

            </div>
        `;

    } catch (error) {

        console.log(error);

        document.getElementById("weatherResult").innerHTML =
        "<h2>Something went wrong!</h2>";

    }

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

        console.log(error);

        document.getElementById("weatherResult").innerHTML =
        "<h2>Something went wrong!</h2>";

    }

}


function showError(error){

    alert("Unable to get your location.");

}
async function showPosition(position){

    try{

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        const weather = data.weather[0].main;

        showWeatherAnimation(weather);

        const body = document.body;
        body.className = "";

        if (weather === "Clear") {
            body.classList.add("sunny");
        }
        else if (weather === "Clouds") {
            body.classList.add("cloudy");
        }
        else if (weather === "Rain" || weather === "Drizzle") {
            body.classList.add("rainy");
        }
        else if (weather === "Snow") {
            body.classList.add("snowy");
        }
        else {
            body.classList.add("default");
        }

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
                    <h4>🤗 Feels Like</h4>
                    <p>${data.main.feels_like} °C</p>
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
                    <h4>📉 Min</h4>
                    <p>${data.main.temp_min} °C</p>
                </div>

                <div class="card">
                    <h4>📈 Max</h4>
                    <p>${data.main.temp_max} °C</p>
                </div>

            </div>
        `;

catch(error){

    console.log(error);

    document.getElementById("weatherResult").innerHTML =
    "<h2>Something went wrong!</h2>";

}

}
