var map = L.map('map').setView([20,0],2);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let markers = [];

async function loadEvents(){

let language = document.getElementById("languageSelect").value;

let days = document.getElementById("timeFilter").value;

let date = new Date();

date.setDate(date.getDate() - days);

let fromDate = date.toISOString().split("T")[0];

let apiKey = "f70df91ffd7f4d5eb5bcda1462a0aae0";

let url = `https://newsapi.org/v2/everything?q=world&from=${fromDate}&language=${language}&apiKey=${apiKey}`;

let response = await fetch(url);

let data = await response.json();

data.articles.forEach(article=>{

let lat = Math.random()*120-60;

let lon = Math.random()*360-180;

L.marker([lat,lon])
.addTo(map)
.bindPopup(

"<b>"+article.title+"</b><br><a href='"+article.url+"' target='_blank'>Read more</a>"

);

});

}
};

events.forEach(event=>{

let marker = L.marker([event.lat,event.lon])
.addTo(map)
.bindPopup("<b>"+event.title+"</b><br>"+event.description);

marker.type = event.type;

markers.push(marker);

counts[event.type]++;

});

createChart(counts);

createHeatmap(events);

}

loadEvents();


document.getElementById("filter").addEventListener("change",function(){

let value = this.value;

markers.forEach(marker=>{

if(value==="all" || marker.type===value)
{
map.addLayer(marker);
}
else
{
map.removeLayer(marker);
}

});

});


function toggleTheme(){

document.body.classList.toggle("light");

}


async function searchCountry(){

let country = document.getElementById("countrySearch").value;

let response = await fetch(
"https://nominatim.openstreetmap.org/search?country="+country+"&format=json"
);

let data = await response.json();

if(data.length>0){

map.setView([data[0].lat,data[0].lon],5);

}

}


function createChart(counts){

const ctx = document.getElementById('eventsChart');

new Chart(ctx,{

type:'bar',

data:{
labels:['Tech','Disaster','Politics'],

datasets:[{
label:'Events',
data:[counts.tech,counts.disaster,counts.politics]
}]

}

});

}


function createHeatmap(events){

let heatPoints=[];

events.forEach(e=>{

heatPoints.push([e.lat,e.lon,0.8]);

});

L.heatLayer(heatPoints,{radius:25}).addTo(map);

}


async function loadNews(){

let response = await fetch(
"https://newsapi.org/v2/top-headlines?language=en&apiKey=f70df91ffd7f4d5eb5bcda1462a0aae0"
);

let data = await response.json();

data.articles.forEach(article=>{

let lat=Math.random()*120-60;
let lon=Math.random()*360-180;

L.marker([lat,lon])
.addTo(map)
.bindPopup(article.title);

});

}

loadNews();
