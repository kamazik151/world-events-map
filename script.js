// script.js — фінальний робочий для GitHub Pages

document.addEventListener("DOMContentLoaded", function() {

    // ---------------------------
    // 1️⃣ Ініціалізація карти
    // ---------------------------
    var map = L.map('map').setView([20,0],2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);

    // ---------------------------
    // 2️⃣ Глобальні змінні
    // ---------------------------
    let markers = [];
    let events = [];
    let counts = { tech:0, disaster:0, politics:0 };

    // ---------------------------
    // 3️⃣ Тестові маркери (замінюють NewsAPI для GitHub Pages)
    // ---------------------------
    function loadTestEvents() {
        for(let i=0;i<15;i++){
            let lat = Math.random()*120-60;
            let lon = Math.random()*360-180;
            let types = ["tech","disaster","politics"];
            let type = types[i%3];

            let marker = L.marker([lat,lon])
                .addTo(map)
                .bindPopup(`Event ${i+1} <br> Type: ${type}`);
            marker.type = type;
            markers.push(marker);

            events.push({lat, lon, title:`Event ${i+1}`, type});
            counts[type]++;
        }

        createChart(counts);
        createHeatmap(events);
    }

    loadTestEvents(); // додаємо маркери та графік/heatmap

    // ---------------------------
    // 4️⃣ Фільтр за типом події
    // ---------------------------
    document.getElementById("filter").addEventListener("change", function(){
        let value = this.value;
        markers.forEach(marker => {
            if(value==="all" || marker.type===value) map.addLayer(marker);
            else map.removeLayer(marker);
        });
    });

    // ---------------------------
    // 5️⃣ Темна/світла тема
    // ---------------------------
    window.toggleTheme = function(){
        document.body.classList.toggle("light");
    }

    // ---------------------------
    // 6️⃣ Пошук країни
    // ---------------------------
    window.searchCountry = async function(){
        let country = document.getElementById("countrySearch").value;
        if(!country) return;

        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/search?country=${country}&format=json`);
            let data = await response.json();

            if(data.length>0) map.setView([data[0].lat, data[0].lon],5);
            else alert("Країну не знайдено");
        } catch(err){
            console.error("Помилка пошуку країни:", err);
        }
    }

    // ---------------------------
    // 7️⃣ Chart.js графік
    // ---------------------------
    function createChart(counts){
        const ctx = document.getElementById('eventsChart');
        new Chart(ctx, {
            type:'bar',
            data:{
                labels:['Tech','Disaster','Politics'],
                datasets:[{
                    label:'Events',
                    data:[counts.tech, counts.disaster, counts.politics],
                    backgroundColor:['#34d399','#f87171','#60a5fa']
                }]
            },
            options:{ responsive:true, plugins:{legend:{display:false}} }
        });
    }

    // ---------------------------
    // 8️⃣ Heatmap
    // ---------------------------
    function createHeatmap(events){
        let heatPoints = events.map(e => [e.lat, e.lon, 0.8]);
        L.heatLayer(heatPoints,{radius:25}).addTo(map);
    }

});
