// script.js

document.addEventListener("DOMContentLoaded", async function() {

    // ---------------------------
    // 1️⃣ Ініціалізація карти
    // ---------------------------
    var map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // ---------------------------
    // 2️⃣ Глобальні змінні
    // ---------------------------
    let markers = [];
    let events = []; // масив для подій
    let counts = { tech: 0, disaster: 0, politics: 0 };

    // ---------------------------
    // 3️⃣ Функція завантаження подій з News API
    // ---------------------------
    async function loadEvents() {
        let language = document.getElementById("languageSelect").value;
        let days = document.getElementById("timeFilter").value;

        let date = new Date();
        date.setDate(date.getDate() - days);
        let fromDate = date.toISOString().split("T")[0];

        let apiKey = "f70df91ffd7f4d5eb5bcda1462a0aae0"; // твій News API ключ
        let url = `https://newsapi.org/v2/everything?q=world&from=${fromDate}&language=${language}&apiKey=${apiKey}`;

        try {
            let response = await fetch(url);
            let data = await response.json();

            data.articles.forEach(article => {
                // для демонстрації, даємо випадкові координати
                let lat = Math.random() * 120 - 60;
                let lon = Math.random() * 360 - 180;

                // визначаємо випадковий тип події
                let types = ["tech", "disaster", "politics"];
                let type = types[Math.floor(Math.random() * types.length)];

                // додаємо маркер
                let marker = L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(`<b>${article.title}</b><br><a href="${article.url}" target="_blank">Read more</a>`);

                marker.type = type;
                markers.push(marker);

                // додаємо до масиву подій
                events.push({ lat, lon, title: article.title, type });
                counts[type]++;
            });

            // Створюємо графік і heatmap після додавання всіх маркерів
            createChart(counts);
            createHeatmap(events);

        } catch (err) {
            console.error("Помилка при завантаженні новин:", err);
        }
    }

    // ---------------------------
    // 4️⃣ Фільтр за типом події
    // ---------------------------
    document.getElementById("filter").addEventListener("change", function() {
        let value = this.value;
        markers.forEach(marker => {
            if (value === "all" || marker.type === value) {
                map.addLayer(marker);
            } else {
                map.removeLayer(marker);
            }
        });
    });

    // ---------------------------
    // 5️⃣ Темна/світла тема
    // ---------------------------
    window.toggleTheme = function() {
        document.body.classList.toggle("light");
    }

    // ---------------------------
    // 6️⃣ Пошук країни
    // ---------------------------
    window.searchCountry = async function() {
        let country = document.getElementById("countrySearch").value;
        if (!country) return;

        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/search?country=${country}&format=json`);
            let data = await response.json();

            if (data.length > 0) {
                map.setView([data[0].lat, data[0].lon], 5);
            } else {
                alert("Країну не знайдено");
            }
        } catch (err) {
            console.error("Помилка пошуку країни:", err);
        }
    }

    // ---------------------------
    // 7️⃣ Створення графіка Chart.js
    // ---------------------------
    function createChart(counts) {
        const ctx = document.getElementById('eventsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tech', 'Disaster', 'Politics'],
                datasets: [{
                    label: 'Events',
                    data: [counts.tech, counts.disaster, counts.politics],
                    backgroundColor: ['#34d399','#f87171','#60a5fa']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // ---------------------------
    // 8️⃣ Heatmap
    // ---------------------------
    function createHeatmap(events) {
        let heatPoints = events.map(e => [e.lat, e.lon, 0.8]);
        L.heatLayer(heatPoints, { radius: 25 }).addTo(map);
    }

    // ---------------------------
    // 9️⃣ Виклик завантаження подій після створення карти
    // ---------------------------
    await loadEvents();

});
