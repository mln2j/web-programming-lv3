document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/weather-data.csv')
        .then(response => response.text())
        .then(csv => {
            const rezultat = Papa.parse(csv, {
                header: true,
                skipEmptyLines: true
            });

            const tbody = document.querySelector('.vrijeme-info table tbody');
            const noDataMessage = document.querySelector('#no-data-message'); // ID za element koji prikazuje poruku o nedostatku podataka
            const tableWrapper = document.querySelector('.table-wrapper'); // ID za wrapper tablice
            tbody.innerHTML = '';
            noDataMessage.style.display = 'none'; // Sakrij poruku na početku
            tableWrapper.style.display = 'block'; // Osiguraj da je tablica prikazana pri učitavanju

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

            // Funkcija za pohranu podataka u localStorage
            const dodajUPlaner = (podatak) => {
                // Provjeriti postoji li već planer u localStorage
                let planer = JSON.parse(localStorage.getItem('planer')) || [];

                // Provjera da li je podatak već u planer
                const postojiUPlaneru = planer.some(item => item.Location === podatak.Location && item.Temp === podatak.Temp);

                if (!postojiUPlaneru) {
                    // Dodaj podatak u planer
                    planer.push(podatak);
                    // Spremi ažurirani planer u localStorage
                    localStorage.setItem('planer', JSON.stringify(planer));
                    alert("Izlet je dodan u planer!");
                } else {
                    alert("Ovaj izlet je već u planeru!");
                }
            };

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

                if (filteredData.length === 0) {
                    noDataMessage.style.display = 'block'; // Prikazivanje poruke o nedostatku podataka
                    tableWrapper.style.display = 'none'; // Sakrij tablicu
                } else {
                    noDataMessage.style.display = 'none'; // Sakrij poruku ako podaci postoje
                    tableWrapper.style.display = 'block'; // Prikazivanje tablice ako podaci postoje
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
        })
        .catch(err => console.error("Greška prilikom dohvaćanja CSV-a:", err));
});
