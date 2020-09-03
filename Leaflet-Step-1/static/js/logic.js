//GeoJSON Earthquake Data found on the USGS website
const earthquake_data_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create map
const myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4,
});

// Define satellite map and grayscale map layers
const satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Create the Earthquake Layer
d3.json(earthquake_data_url, function(earthquakeData) {
    // Define a function to style each circle based on earthquake magnitude
    function circleStyle(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: magColor(feature.properties.mag),
            color: "#000000",
            radius: (feature.properties.mag)*4,
            stroke: true,
            weight: 0.5
        };
    }

    function magColor(magnitude){
        if (magnitude >= 5){
            return "#ff6666";
        }else if (magnitude >= 4){
            return "#ffb366";
        }else if (magnitude >= 3){
            return "#ffd966";
        }else if (magnitude >= 2){
            return "#ffff66";
        }else if (magnitude >= 1){
            return "#d9ff66";
        }else{
            return "#66ff66";
        }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    L.geoJSON(earthquakeData, {
        // Make a cricle marker for each earthquake 
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Style each circle
        style: circleStyle,

        // Give each feature a popup describing the place, time, and magnitude of the earthquake
        onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p> Time: " + new Date(feature.properties.time) + 
        "</p><br><p> Magnitude " + feature.properties.mag + "</p>");
        }
    }).addTo(myMap);
});

//Add a Legend
function magColor(magnitude){
    if (magnitude >= 5){
        return "#ff6666";
    }else if (magnitude >= 4){
        return "#ffb366";
    }else if (magnitude >= 3){
        return "#ffd966";
    }else if (magnitude >= 2){
        return "#ffff66";
    }else if (magnitude >= 1){
        return "#d9ff66";
    }else{
        return "#66ff66";
    }
}
var legend = L.control({
    position: "bottomright"
});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
    labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + magColor(i) + '"></i> ' +
              labels[i] + '<br>';
    }
    return div;
};
legend.addTo(myMap);