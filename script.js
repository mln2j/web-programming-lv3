document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/weather-data.csv')
        .then(response => response.text())
        .then(csv => {
            const rezultat = Papa.parse(csv, {
                header: true,
                skipEmptyLines: true
            });

            const tbody = document.querySelector('.vrijeme-info table tbody');
            tbody.innerHTML = '';

            console.log(rezultat.data);

            rezultat.data.forEach(red => {
                const tr = document.createElement('tr');

                const vrijednosti = [
                    red["Temp"],
                    red["Humidity"],
                    red["Wind"],
                    red["Precipitation"],
                    red["Clouds"],
                    red["Pressure"],
                    red["UV"],
                    red["Season"],
                    red["Visibility"],
                    red["Location"],
                    red["Weather"]
                ];

                vrijednosti.forEach(vrijednost => {
                    const td = document.createElement('td');
                    td.textContent = vrijednost;
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("Greška prilikom dohvaćanja CSV-a:", err));
});
