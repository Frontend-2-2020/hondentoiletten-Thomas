import '../styles/index.scss';

// Import leaflet API
import L from "leaflet";

// Import leaflet css
import "leaflet/dist/leaflet.css";

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [51.054633,3.7197544],
    zoom: 18
});

// Add layer tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add marker
L.marker([51.054633,3.7197544]).addTo(map);


