/* coordenadas da localização */
window.addEventListener('load', () => {
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description span');
    let temperatureFeelsType = document.querySelector('.feels-type');
    let temperatureFeels = document.querySelector('.temperature-feels span');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let temperatureTimezone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.degree-section');
    let temperatureSpan = document.querySelector('.degree-type');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            //API for weather data
            const proxy = `https://cors-anywhere.herokuapp.com/`;
            const api = `${proxy}https://api.darksky.net/forecast/b6fa6485a4b5a42e231ca399cc723b84/${lat},${long}`

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    console.log(data);
                    const {
                        temperature,
                        summary,
                        icon,
                        apparentTemperature
                    } = data.currently;

                    //set DOM elements
                    temperatureDegree.textContent = setTemperature(temperature);
                    temperatureDescription.textContent = summary;
                    temperatureFeels.textContent = setTemperature(apparentTemperature);
                    temperatureTimezone.textContent = trimLocation(data.timezone);

                    console.log(trimLocation(data.timezone));

                    //set Icon
                    setIcon(icon, document.querySelector('.icon'));

                    //Change celsius/farenheit
                    temperatureSection.addEventListener("click", () => {
                        if (temperatureSpan.textContent === "F") {
                            temperatureSpan.textContent = "C";
                            temperatureFeelsType.textContent = "C";
                            temperatureDegree.textContent = setTemperature(temperature);
                            temperatureFeels.textContent = setTemperature(apparentTemperature);
                        } else {
                            temperatureSpan.textContent = "F";
                            temperatureFeelsType.textContent = "F";
                            temperatureDegree.textContent = Math.floor(temperature);
                            temperatureFeels.textContent = Math.floor(apparentTemperature);
                        }
                    });

                })
        });

        function trimLocation(text) {
            let t = text.split('/');
            return t[1];
        }

        function setTemperature(t) {
            const temp = Math.floor((t - 32) * (5 / 9));
            return temp;
        }

        function setIcon(icon, iconId) {
            const skycons = new Skycons({
                color: "white"
            });

            const currentIcon = icon.replace(/-/g, "_").toUpperCase();
            skycons.play();
            return skycons.set(iconId, Skycons[currentIcon]);
        }
    }
});