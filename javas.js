const apikey = "69980228ae995bc1e8638e152bc90646";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
// Options for formatting the date
const options = {
    weekday: 'long', // Display the full name of the day of the week (e.g., "Friday")
    day: 'numeric', // Display the day of the month as a number (e.g., "26")
    month: 'short' // Display the full name of the month (e.g., "April")
    };

async function getWeatherByCity(city) {
    const response = await fetch(`${apiUrl}weather?units=metric&q=${city}&appid=${apikey}`);
    return await response.json();
}

async function getWeatherByCoordinates(lat, lon) {
    const response = await fetch(`${apiUrl}weather?units=metric&lat=${lat}&lon=${lon}&appid=${apikey}`);
    return await response.json();
}

async function getForecast(city) {
    const response = await fetch(`${apiUrl}forecast?units=metric&q=${city}&appid=${apikey}`);
    return await response.json();
}

async function displayCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const { latitude, longitude } = position.coords;
            const currentLocationWeather = await getWeatherByCoordinates(latitude, longitude);
            displayWeatherData(currentLocationWeather);
            displayForecast(currentLocationWeather.name)
            console.log(currentLocationWeather.name)
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function displayWeatherData(p) {
    console.log(p);
    document.querySelector(".cityname").innerHTML = p.name +' , '+p.sys.country;
    const maindiv = document.getElementById("divv");
    if (p.main.temp < 20){
        maindiv.style.backgroundColor = "gray";
    }else{
        maindiv.style.backgroundColor = "white" ;
    }

    document.querySelector(".wet").innerHTML = Math.round(p.main.temp) + '°';
    document.querySelector(".wind").innerHTML = Math.round(p.wind.speed) + 'kmh';
    document.querySelector(".hu").innerHTML = p.main.humidity + '%';
    document.querySelector(".clo").innerHTML = p.weather[0].description;
    document.querySelector(".minw").innerHTML = Math.round(p.main.temp_min) + '°';
    document.querySelector(".maxw").innerHTML = Math.round(p.main.temp_max) + '°';
    // Set the icon for weather
    const iconUrl = `https://openweathermap.org/img/wn/${p.weather[0].icon}@2x.png`;
    document.querySelector(".icon1").setAttribute("src", iconUrl);
    // Assuming p.visibility contains the visibility value in meters
    const visibilityInKm = Math.round((p.visibility / 1000).toFixed(1)); // Convert meters to kilometers and round to 1 decimal place
    document.querySelector(".vis").innerHTML = `${visibilityInKm}km`;
    
}

let myChart; 
async function displayForecast(city) {
    const dataf = await getForecast(city);
    // Get the hour of the first forecast
    const firstForecastDateTime = new Date(dataf.list[0].dt_txt);
    const firstForecastHour = firstForecastDateTime.getHours();
    const labels = [];
    const temperatures = [];
    
    

    // Assuming your date is stored in a variable named 'dateString'
    const dato = new Date(dataf.list[0].dt_txt);

    // Format the date using the options
    const formattedDate = dato.toLocaleDateString('en-US', options);
    document.querySelector(".dato").innerHTML = formattedDate ;
    
    console.log(dataf);
    
    // Filter the forecasts to get only one forecast per day at the same hour as the first forecast
    document.getElementById("forecast").innerHTML = "";
    const uniqueForecasts = {};
    dataf.list.forEach(forecast => {
        
        const forecastDateTime = new Date(forecast.dt_txt);
        const date = forecastDateTime.getDate();
        const hour = forecastDateTime.getHours();
        if (hour === firstForecastHour) {
            const key = date.toString();
            if (!uniqueForecasts[key]) {
                uniqueForecasts[key] = forecast;
                const day = forecastDateTime.toLocaleDateString('en-US', { weekday: 'short' });
                const temperature = Math.round(forecast.main.temp);
                const icon = forecast.weather[0].icon;
                
                labels.push(day);
                temperatures.push(temperature);
                
                
                const forecastElement = document.createElement("div");
                forecastElement.classList.add("text-center", "mb-0", "flex", "items-center", "justify-center", "flex-col");
                forecastElement.innerHTML = `
                    <span class="block my-1">${day}</span>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" class="block w-8 h-8">
                    <span class="block my-1">${temperature}&deg;</span>
                `;
                document.getElementById("forecast").appendChild(forecastElement);
            }
        }
    });
    if (!myChart) {
    const ctx = document.getElementById('myChart');
     myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                data: temperatures,
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'blue dark'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}else{
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = temperatures;
        myChart.update();
    }
}













// async function displayForecast(city) {
//     const dataf = await getForecast(city);
//     document.getElementById("forecast").innerHTML = "";
//     console.log(dataf.list);
//     for (let i = 0; i < 5; i++) {
//     const forecast = dataf.list[i];
// const date = new Date(forecast.dt * 1000);
// const day = date.toLocaleDateString('en-US', { weekday: 'short' });
// const temperature = Math.round(forecast.main.temp);
// const icon = forecast.weather[0].icon;

//     // const nextFiveDays = forecastData.list.slice(0, 5);
//     // nextFiveDays.forEach(forecast => {
//     //     const date = new Date(forecast.dt * 1000);
//     //     const options = { weekday: 'short', month: 'short', day: 'numeric' };
//     //     const formattedDate = date.toLocaleDateString('en-US', options);
//     //     const temperature = Math.round(forecast.main.temp);
//     //     const icon = forecast.weather[0].icon;


//         const forecastElement = document.createElement("div");
//         forecastElement.classList.add("text-center", "mb-0", "flex", "items-center", "justify-center", "flex-col");
//         forecastElement.innerHTML = `
//             <span class="block my-1">${day}</span>
//             <img src="https://openweathermap.org/img/wn/${icon}.png" class="block w-8 h-8">
//             <span class="block my-1">${temperature}&deg;</span>
//         `;
//         document.getElementById("forecast").appendChild(forecastElement);
//     };
// }

// Display weather for the current location when the page loads
displayCurrentLocationWeather();

// Event listener for the input field to display weather for the entered city
document.getElementById("cityInput").addEventListener("change", async function() {
    const city = this.value.trim();
    if (city !== "") {
        const cityWeather = await getWeatherByCity(city);
        if (cityWeather.cod === "404") {
            alert("Please enter a valid city name");
            return;
        }
        displayWeatherData(cityWeather);
        displayForecast(city);
    } else {
        alert("Please enter a city name");
    }
});



