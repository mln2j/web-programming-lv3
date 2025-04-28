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

            console.log(rezultat.data); // Provjerite podatke

            const filterSeason = document.getElementById('filter-season');
            const filterLocation = document.getElementById('filter-location');
            const filterTempRange = document.getElementById('filter-temp-range');
            const tempValue = document.getElementById('temp-value');
            const applyFiltersButton = document.getElementById('primijeni-filtere');

            // Ažuriraj prikaz temperature prema slideru
            filterTempRange.addEventListener('input', () => {
                tempValue.textContent = `${filterTempRange.value}°C`;
            });

            // Filtriranje i prikazivanje podataka
            const applyFilters = () => {
                const seasonValue = filterSeason.value;
                const locationValue = filterLocation.value.toLowerCase();
                const tempValueSlider = parseInt(filterTempRange.value);

                // Filtriraj podatke prema kriterijima
                const filteredData = rezultat.data.filter(row => {
                    // Filter po sezoni
                    const seasonMatch = seasonValue ? row["Season"] === seasonValue : true;
                    // Filter po lokaciji
                    const locationMatch = locationValue ? row["Location"].toLowerCase().includes(locationValue) : true;
                    // Filter po temperaturi
                    const tempMatch = row["Temp"] && parseInt(row["Temp"]) <= tempValueSlider;

                    return seasonMatch && locationMatch && tempMatch;
                });

                // Prikazivanje filtriranih podataka u tablici
                tbody.innerHTML = ''; // Očisti tablicu prije dodavanja novih podataka

                filteredData.forEach(red => {
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
            };

            // Dodaj event listener za filtriranje kada se klikne na "Filtriraj"
            applyFiltersButton.addEventListener('click', applyFilters);

            // Početno filtriranje (ako je potrebno)
            applyFilters();
        })
        .catch(err => console.error("Greška prilikom dohvaćanja CSV-a:", err));
});
