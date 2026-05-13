const cityInput = document.getElementById('custom-city-input');
const suggestionsDiv = document.getElementById('custom-city-suggestions');
const deleteButton = document.getElementById('delete');
const currentCityName = document.getElementById('currentCityName');
const searchButton = document.getElementById('searchButton');
const currentDate = document.getElementById('currentDate');
const currentTemperature = document.getElementById('currentTemperature');
const currentDescription = document.getElementById('currentDescription');
const currentWind = document.getElementById('currentWind');
const currentHumidity = document.getElementById('currentHumidity');
const currentPrecipitation = document.getElementById('currentPrecipitation');
const errorMessage = document.getElementById('errorMessage');
const loadingElement = document.getElementById('loading');
const weatherInformation = document.getElementById('weatherInformation')

const allCities = [
    { label: "East Azerbaijan" },
    { label: "West Azerbaijan" },
    { label: "Ardabil" },
    { label: "Isfahan" },
    { label: "Alborz" },
    { label: "Ilam" },
    { label: "Bushehr" },
    { label: "Tehran" },
    { label: "Chaharmahal and Bakhtiari" },
    { label: "South Khorasan" },
    { label: "Razavi Khorasan" },
    { label: "North Khorasan" },
    { label: "Khuzestan" },
    { label: "Zanjan" },
    { label: "Semnan" },
    { label: "Sistan and Baluchestan" },
    { label: "Fars" },
    { label: "Qazvin" },
    { label: "Qom" },
    { label: "Kurdistan" },
    { label: "Kerman" },
    { label: "Kermanshah" },
    { label: "Kohgiluyeh and Boyer-Ahmad" },
    { label: "Golestan" },
    { label: "Gilan" },
    { label: "Lorestan" },
    { label: "Mazandaran" },
    { label: "Markazi" },
    { label: "Hormozgan" },
    { label: "Hamedan" },
    { label: "Yazd" }
];
function suggestionsBox() {
    suggestionsDiv.innerHTML = '';
    allCities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = city.label;
        suggestionItem.className = 'p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0';
        suggestionItem.addEventListener('click', () => {
            cityInput.value = city.label;
            suggestionsDiv.classList.add('hidden');
        });
        suggestionsDiv.appendChild(suggestionItem);
    });
}

function filterAndSuggestions(filterText = '') {
    const items = suggestionsDiv.querySelectorAll('div');
    let visibleCount = 0;
    items.forEach(item => {
        const cityName = item.textContent || '';
        if (!filterText || cityName.toLowerCase().includes(filterText.toLowerCase())) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    if (visibleCount > 0) {
        suggestionsDiv.classList.remove('hidden');
    } else {
        suggestionsDiv.classList.add('hidden');
    }
}

suggestionsBox();

cityInput.addEventListener('input', () => {
    filterAndSuggestions(cityInput.value);
});

cityInput.addEventListener('focus', () => {
    filterAndSuggestions(cityInput.value);
});

document.addEventListener('click', (event) => {
    if (!cityInput.contains(event.target) && !suggestionsDiv.contains(event.target)) {
        suggestionsDiv.classList.add('hidden');
    }
});

deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    cityInput.value = '';
    cityInput.focus();
    suggestionsBox();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete' && document.activeElement === cityInput) {
        cityInput.value = '';
        suggestionsBox();
    }
});

async function getWeather(city) {
    showLoading(true);
    hideError();
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fa`;

    try {
        const weatherResponse = await fetch(apiUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            throw new Error(weatherData.message || 'Error fetching weather data:');
        }

        displayCurrentWeather(weatherData);
        showLoading(false);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showLoading(false);
        showError('Failed to connect to the server');
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingElement.style.display = 'block';
    } else {
        loadingElement.style.display = 'none';
    }
}

function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

function hideError() {
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
}
const now = new Date();
currentDate.textContent = now.toLocaleDateString()

function displayCurrentWeather(data) {

    currentTemperature.innerHTML = `${Math.round(data.main.temp)}<span class="text-5xl">°C</span>`;

    currentDescription.textContent = data.weather[0].description;

    const windSpeed = Math.round(data.wind.speed * 3.6);
    currentWind.innerHTML = `<span>${windSpeed}</span> km/h`;

    const humidity = data.main.humidity;
    currentHumidity.innerHTML = `<span>${humidity}</span>%`;

    const precip = data.rain ? (data.rain['1h'] || 0) : 0;
    currentPrecipitation.innerHTML = `<span>${precip}</span> mm`;
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        showError('Please enter the city name.');
        showLoading(false);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});


// animation
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 300;
let nebulae = [];
let planets = [];
const orbitLines = true;
const orbitLineColor = 'rgba(255, 255, 255, 0.1)';
const orbitLineWidth = 1;

function resizeCanvas() {
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    const dpr = window.devicePixelRatio || 1;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    updateAnimationParameters(displayWidth, displayHeight);

    drawBackground();
}

function updateAnimationParameters(width, height) {
    stars.length = 0;
    nebulae.length = 0;
    planets.length = 0;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            twinkle: Math.random()
        });
    }

    nebulae.push(
        { color: 'rgba(100, 50, 150, 0.4)', x: width * 0.2, y: height * 0.3, radius: width * 0.3 },
        { color: 'rgba(150, 75, 100, 0.3)', x: width * 0.7, y: height * 0.6, radius: width * 0.25 },
        { color: 'rgba(50, 75, 150, 0.35)', x: width * 0.5, y: height * 0.9, radius: width * 0.35 }
    );

    const originalPlanetsData = [
        { x: width * 0.8, y: height * 0.2, radius: 30, color: 'rgba(200, 150, 50, 0.8)', orbitRadiusRatio: 0.3 },
        { x: width * 0.3, y: height * 0.7, radius: 20, color: 'rgba(100, 180, 220, 0.7)', orbitRadiusRatio: 0.2 }
    ];

    planets = originalPlanetsData.map(p => ({
        ...p,
        orbitRadius: Math.min(width, height) * p.orbitRadiusRatio,
        orbitAngle: Math.random() * Math.PI * 2
    }));
}

function drawNebula(nebula) {
    const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
    gradient.addColorStop(0, nebula.color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
}

function drawStar(star) {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.twinkle < 0.5 ? 0.5 + star.twinkle : 1 - star.twinkle})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlanet(planet) {
    if (orbitLines) {
        ctx.strokeStyle = orbitLineColor;
        ctx.lineWidth = orbitLineWidth;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(planet.currentX, planet.currentY, planet.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    nebulae.forEach(drawNebula);

    stars.forEach(drawStar);

    if (orbitLines) {
        planets.forEach(drawPlanet);
    }
}

function update() {
    const now = Date.now() / 2000;
    planets.forEach(planet => {
        const currentX = planet.x + planet.orbitRadius * Math.cos(planet.orbitAngle + now);
        const currentY = planet.y + planet.orbitRadius * Math.sin(planet.orbitAngle + now);
        planet.currentX = currentX;
        planet.currentY = currentY;
    });
}

function animate() {
    update();
    drawBackground();
    planets.forEach(drawPlanet);
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

function initialize() {

    resizeCanvas();
    animate();
}

initialize();
