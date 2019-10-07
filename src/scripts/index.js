import '../styles/index.scss';

// Import leaflet API
import L from "leaflet";

// Import leaflet css
import "leaflet/dist/leaflet.css";

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [51.0634127,3.7243032],
    zoom: 16
});

// Add layer tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Make new icon
var myIcon = L.icon({
    iconUrl: 'public/marker.png',
    iconSize: [25, 35], // grootte van icon
    iconAnchor: [16, 37],
    popupAnchor: [-3, -76],
});

// Import axios
import axios from 'axios';
 
// Make an axios request from Gent Hondenvoorzieningen json
axios.get('https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson')
  .then(function (response) {

    // Make data variable match array of coordinates
    var data = response.data.coordinates;
    console.log(data);

    // For loop to generate all locations in the dataset
    for (let i = 0; i < data.length; i++) {
        const location = data[i];
        // Add markers
        L.marker([location[1],location[0]], {icon: myIcon}).addTo(map);
        
    }
  });

