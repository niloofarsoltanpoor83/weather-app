console.log("Scriptloaded");
const API_KEY = "c7246f4ed11c174296162dff32c97872";

document.getElementById("searchBtn").addEventListener("click", getWeather);

document.getElementById("cityInput").addEventListener("keydown", function(event) {

    console.log("Key:", event.key);

    if (event.key === "Enter") {
        event.preventDefault();
        console.log("Enter detected");
        getWeather();
    }

});


console.log("Button clicked");


async function getWeather() {

    try {

        const city = document.getElementById("cityInput").value;

        document.getElementById("weatherResult").innerHTML =
        "<h3>Loading...</h3>";


        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;


        const response = await fetch(url);

        console.log(response);


        const data = await response.json();
        
const weather = data.weather[0].main;

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
        console.log(data);


        if (data.cod == "404") {

            document.getElementById("weatherResult").innerHTML =
            "<h2>City not found!</h2>";

            return;
        }


        const icon = data.weather[0].icon;

        const iconUrl =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;



        document.getElementById("weatherResult").innerHTML = `

        <h2>${data.name}</h2>

        <img src="${iconUrl}" alt="Weather Icon">


        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>

        <p><strong>Weather:</strong> ${data.weather[0].description}</p>

        <p><strong>Feels Like:</strong> ${data.main.feels_like} °C</p>

        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>

        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>

        <p><strong>Min Temp:</strong> ${data.main.temp_min} °C</p>

        <p><strong>Max Temp:</strong> ${data.main.temp_max} °C</p>

        `;
} catch (error) {

    console.log(error);

    document.getElementById("weatherResult").innerHTML =
    "<h2>Something went wrong!</h2>";
    }
}
