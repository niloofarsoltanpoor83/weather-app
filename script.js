const API_KEY = "c7246f4ed11c174296162dff32c97872";


const button = document.getElementById("searchBtn");


button.addEventListener("click", getWeather);



async function getWeather(){

    const city = document.getElementById("cityInput").value;


    const url = 
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;


    const response = await fetch(url);


    const data = await response.json();


    console.log(data);


    document.getElementById("weatherResult").innerHTML = `

        <h2>${data.name}</h2>

        <p>${data.main.temp} °C</p>

        <p>${data.weather[0].description}</p>

    `;

}
