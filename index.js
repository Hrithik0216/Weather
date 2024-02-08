
const input = document.getElementById('myInput');
const dropdown = document.getElementById('dropdown');
let data;

async function search(place) {
    const api = `http://api.geonames.org/postalCodeSearchJSON?placename_startsWith=${place}&maxRows=5&username=Arun&country=IN`;

    try {
        const res = await fetch(api);
        data = await res.json();

        dropdown.innerHTML = '';

        if (data.postalCodes) {
            data.postalCodes.forEach((postalCode) => {
                const listItem = document.createElement('li');
                listItem.textContent = postalCode.placeName;
                listItem.value = postalCode.placeName
                listItem.addEventListener('click', function () {
                    input.value = postalCode.placeName;
                    clearAutocomplete();
                    SelectFromOptions(postalCode);
                });
                dropdown.appendChild(listItem);
            });
        }

    } catch (e) {
        console.log('Error in autocomplete: ' + e);
    }
}

function clearAutocomplete() {
    dropdown.innerHTML = '';
    input.value = '';
}

function SelectFromOptions(postalCode) {
    console.log('SelectFromOptions function has been invoked');
    const str = JSON.stringify(postalCode);
    console.log('The single object: ' + str);
    console.log(postalCode.lat);
    console.log(postalCode.lng);
    console.log(postalCode.placeName);
    const properPlacename = postalCode.placeName.replace(/[^a-zA-Z0-9]/g, "_");

    getWeatherDetails(postalCode.lat, postalCode.lng)
    const name = document.getElementById("text-wrapper-2");
    name.innerHTML = postalCode.placeName;

    try {
        // localStorage.setItem(properPlacename, JSON.stringify({ place: postalCode.placeName, lat: postalCode.lat, lng: postalCode.lng }));
        localStorage.setItem(properPlacename, JSON.stringify({ lat: postalCode.lat, lng: postalCode.lng }));
        // let retrievedData = JSON.parse(localStorage.getItem(properPlacename))
        // console.log(Object.entries(localStorage))
        for (const key in localStorage) {
            console.log(key, localStorage.getItem(key));   
          }
        // localStorage.clear()
       
    } catch (e) {
        console.log("LocalStorage function is not invoked. The reason is " + e)
    }
}






let selectedIndex = -1;
input.addEventListener('keydown', function (e) {
    const dropdownItems = document.querySelectorAll('#dropdown li');

    if (e.key === 'ArrowDown' && selectedIndex <= dropdownItems.length - 1) {
        selectedIndex++;
    } else if (e.key === 'ArrowUp' && selectedIndex > 0) {
        selectedIndex--;
    }

    // Highlight the selected item
    dropdownItems.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedIndex);
    });
});

input.addEventListener('keyup', function (e) {
    if (e.key === 'Enter' && selectedIndex !== -1) {
        const selectedListItem = document.querySelectorAll('#dropdown li')[selectedIndex];
        if (selectedListItem) {
            const selectedPlace = data.postalCodes[selectedIndex];
            input.value = selectedPlace.placeName;
            clearAutocomplete();
            SelectFromOptions(selectedPlace);
        }
    }
});



let data2;
async function getWeatherDetails(lat, lon) {
    const key = "e3b48c2b7880735a8c105294ce15004a";
    const api2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
    try {
        const response = await fetch(api2);
        data2 = await response.json();
        console.log(data2);
    } catch (e) {
        console.log("The error is: " + e);
    }
    const humidity = document.getElementById("text-wrapper-3");
    const visibility = document.getElementById("text-wrapper-4");
    const airPressure = document.getElementById("text-wrapper-5");
    const wind = document.getElementById("text-wrapper-6");
    const temp = document.getElementById("text-wrapper");
    const time = document.getElementById("aug-tue");
    const currTime = document.getElementById("text-wrapper-11")
    const sunset = document.getElementById("text-wrapper-17")
    const sunise = document.getElementById("text-wrapper-24")

    const timeStamp = moment.unix(data2.dt);
    const result = timeStamp.format("MMM DD, ddd");
    const currectTime = timeStamp.format("h:mm A");

    const sunStamp = moment.unix(data2.sys.sunset)
    const sunSet = sunStamp.format("h:mm A")

    const sunStamp2 = moment.unix(data2.sys.sunrise)
    const sunRise = sunStamp2.format("h:mm A")

    temp.innerHTML = (data2.main.temp_max - 273).toFixed(2) + "°C";
    humidity.innerHTML = data2.main.humidity + "%";
    wind.innerHTML = data2.wind.speed + " mph";
    visibility.innerHTML = (data2.visibility / 1000) + " km";
    airPressure.innerHTML = data2.main.pressure + " hPa";
    time.innerHTML = result;
    currTime.innerHTML = currectTime
    // sunset.innerHTML = sunSet
    // sunrise.innerHTML = sunRise
    console.log(currTime)
    // console.log(sunset)


    // document.getElementById("searchInput").value = ""
}

input.addEventListener('input', function (e) {
    const place = e.target.value;
    if (place.trim() !== '') {
        search(place);
    } else {
        clearAutocomplete();
    }
});

// Assuming the checkbox is inside the #toggleButton
const toggleButton = document.getElementById('toggleButton');
const temperatureUnitCheckbox = toggleButton.querySelector('input[type="checkbox"]');

temperatureUnitCheckbox.addEventListener('change', function () {
    const temperatureValue = data2.main.temp_max - 273;
    const temp = document.getElementById("text-wrapper");

    if (this.checked) {
        const temperatureFahrenheit = (temperatureValue * 9 / 5 + 32).toFixed(2);
        temp.innerHTML = temperatureFahrenheit + "F";
    } else {
        temp.innerHTML = temperatureValue.toFixed(2) + "°C";
    }
});