document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/weather-data.csv')
        .then(response => response.text())
        .then(csv => {
            const rezultat = Papa.parse(csv, {
                header: true,
                skipEmptyLines: true
            });

            const tbody = document.querySelector('.vrijeme-info table tbody');
            const noDataMessage = document.querySelector('#no-data-message');
            const tableWrapper = document.querySelector('.table-wrapper');
            tbody.innerHTML = '';
            noDataMessage.style.display = 'none';
            tableWrapper.style.display = 'block';

            const filterSeason = document.getElementById('filter-season');
            const filterLocation = document.getElementById('filter-location');
            const filterTempRange = document.getElementById('filter-temp-range');
            const tempValue = document.getElementById('temp-value');
            const applyFiltersButton = document.getElementById('primijeni-filtere');

            // Ažuriraj prikaz temperature prema slideru
            filterTempRange.addEventListener('input', () => {
                tempValue.textContent = `${filterTempRange.value}°C`;
            });

            // Funkcija za pohranu podataka u localStorage
            const dodajUPlaner = (podatak) => {
                let planer = JSON.parse(localStorage.getItem('planer')) || [];

                // Provjera da li je podatak već u planer
                const postojiUPlaneru = planer.some(item => item.Location === podatak.Location && item.Temp === podatak.Temp);

                if (!postojiUPlaneru) {
                    planer.push(podatak);
                    localStorage.setItem('planer', JSON.stringify(planer));
                    alert("Izlet je dodan u planer!");
                    prikaziPlaner(); // Ažuriraj planer nakon dodavanja
                } else {
                    alert("Ovaj izlet je već u planeru!");
                }
            };

            // Funkcija za prikaz podataka u planeru
            const prikaziPlaner = () => {
                const planerTbody = document.getElementById('planer-tbody');
                planerTbody.innerHTML = ''; // Očisti planer prije prikaza

                const planer = JSON.parse(localStorage.getItem('planer')) || [];
                if (planer.length === 0) {
                    alert("Planer je prazan.");
                }

                planer.forEach(item => {
                    const tr = document.createElement('tr');
                    const tdLocation = document.createElement('td');
                    tdLocation.textContent = item.Location;
                    tr.appendChild(tdLocation);

                    const tdTemp = document.createElement('td');
                    tdTemp.textContent = item.Temp;
                    tr.appendChild(tdTemp);

                    const tdSeason = document.createElement('td');
                    tdSeason.textContent = item.Season;
                    tr.appendChild(tdSeason);

                    const tdWeather = document.createElement('td');
                    tdWeather.textContent = item.Weather;
                    tr.appendChild(tdWeather);

                    // Dodavanje gumba za uklanjanje iz planera
                    const tdButton = document.createElement('td');
                    const button = document.createElement('button');
                    button.textContent = "Ukloni iz planera";
                    button.classList.add('dodaj-u-planer');
                    button.addEventListener('click', () => ukloniIzPlanera(item)); // Event listener za uklanjanje
                    tdButton.appendChild(button);
                    tr.appendChild(tdButton);

                    planerTbody.appendChild(tr);
                });
            };

            // Funkcija za uklanjanje podataka iz planera
            const ukloniIzPlanera = (item) => {
                let planer = JSON.parse(localStorage.getItem('planer')) || [];
                planer = planer.filter(p => p.Location !== item.Location || p.Temp !== item.Temp); // Filtriraj iz planera
                localStorage.setItem('planer', JSON.stringify(planer)); // Spremi ažurirani planer
                prikaziPlaner(); // Ažuriraj planer
            };

            // Filtriranje i prikazivanje podataka
            const applyFilters = () => {
                const seasonValue = filterSeason.value;
                const locationValue = filterLocation.value.toLowerCase();
                const tempValueSlider = parseInt(filterTempRange.value);

                // Filtriraj podatke prema kriterijima
                const filteredData = rezultat.data.filter(row => {
                    const seasonMatch = seasonValue ? row["Season"] === seasonValue : true;
                    const locationMatch = locationValue ? row["Location"].toLowerCase().includes(locationValue) : true;
                    const tempMatch = row["Temp"] && parseInt(row["Temp"]) <= tempValueSlider;

                    return seasonMatch && locationMatch && tempMatch;
                });

                // Prikazivanje filtriranih podataka u tablici
                tbody.innerHTML = ''; // Očisti tablicu prije dodavanja novih podataka

                if (filteredData.length === 0) {
                    noDataMessage.style.display = 'block';
                    tableWrapper.style.display = 'none';
                } else {
                    noDataMessage.style.display = 'none';
                    tableWrapper.style.display = 'block';
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

                        const button = document.createElement('button');
                        button.textContent = "Dodaj u planer";
                        button.classList.add('dodaj-u-planer');
                        button.addEventListener('click', () => dodajUPlaner(red)); // Dodaj event listener za pohranu podataka
                        tr.appendChild(button);

                        tbody.appendChild(tr);
                    });
                }
            };

            // Dodaj event listener za filtriranje kada se klikne na "Filtriraj"
            applyFiltersButton.addEventListener('click', applyFilters);

            // Početno filtriranje (ako je potrebno)
            applyFilters();

            // Početno učitavanje podataka u planer prilikom učitavanja stranice
            prikaziPlaner();
        })
        .catch(err => console.error("Greška prilikom dohvaćanja CSV-a:", err));
});
