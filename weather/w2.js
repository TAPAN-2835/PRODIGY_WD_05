const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

let cityInput = "Kalol";

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    cityInput = search.value.trim();
    fetchWeatherData();
    search.value = "";
    app.style.opacity = "0";
});

function dayOfTheWeek(day, month, year) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

function fetchWeatherData() {
    fetch(`http://api.weatherapi.com/v1/current.json?key=0f35f6122a2a4b68bc7103834241806&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            temp.innerHTML = `${data.current.temp_c}&#176;C`;
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)}, ${d} ${m} ${y}`;
            timeOutput.innerHTML = time;
            icon.src = data.current.condition.icon; // Ensure correct icon path
            cloudOutput.innerHTML = `${data.current.cloud}%`;
            humidityOutput.innerHTML = `${data.current.humidity}%`;
            windOutput.innerHTML = `${data.current.wind_kph} km/h`;

            nameOutput.innerHTML = data.location.name; // Update the city name

            let timeOfDay = data.current.is_day ? "day" : "night";
            btn.style.background = data.current.is_day ? "#e5ba92" : "#181e27";

            const code = data.current.condition.code;

            if (code === 1000) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
            } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
            } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
            } else {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
            }
            app.style.opacity = "1";
        })
        .catch(() => {
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}

fetchWeatherData();
app.style.opacity = "1";
