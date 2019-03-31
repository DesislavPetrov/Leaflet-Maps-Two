var map;
var layerOSM;
var layerWatercolor;
var layerTopo;
var layerImagery;
var layerOutdoors;
var markerCurrentLocation;
var ll;
var popStadium;
var controlZoom;
var controlAttribute;
var controlScale;
var controlPan;
var controlZoomSlider;
var controlMousePosition;
var controlPolylineMeasure;
var controlEasyButton;
var controlEasyButtonSidebar;
var controlSidebar;
var controlOpencageSearch;
var controlLayer;
var baseLayers;
var overlayLayers;
var polygonParks;
var featureGroupMall;
var featureGroupDrawnItems;
var controlDraw;
var controlStyle;
var layerEagleNests;
var layerRaptorNests;


map = L.map('map', {center:[19.4, -99.2], zoom: 13, zoomControl: false, attributionControl: false});

// layerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
layerOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
layerWatercolor = L.tileLayer.provider('Stamen.Watercolor');
layerTopo = L.tileLayer.provider('OpenTopoMap');
layerImagery = L.tileLayer.provider('Esri.WorldImagery');
layerHydra = L.tileLayer.provider('Hydda.Full');

map.addLayer(layerOSM);

baseLayers = {
    "Open Street Maps": layerOSM,
    "Watercolor": layerWatercolor,
    "Topo Map": layerTopo,
    "Imagery": layerImagery,
    "Hydra": layerHydra
};

featureGroupDrawnItems = L.featureGroup().addTo(map);

// layerEagleNests = L.geoJSON.ajax('data/wildlife_eagle.geojson', {pointToLayer: returnEagleMarker, filter: filterEagleNests}).addTo(map);
// layerEagleNests.on('data:loaded', function(){
//     map.fitBounds(layerEagleNests.getBounds());
// })

layerEagleNests = L.geoJSON.ajax('data/wildlife_eagle.geojson', {pointToLayer: returnEagleMarker}).addTo(map);
layerEagleNests.on('data:loaded', function(){
    map.fitBounds(layerEagleNests.getBounds());
})

layerRaptorNests = L.geoJSON.ajax('data/wildlife_raptor.geojson', {pointToLayer: returnRaptorMarker});
layerRaptorNests.on('data:loaded', function(){
    layerRaptorNests.addTo(map);
})

overlayLayers = {
    "Eagle Nests": layerEagleNests,
    "Raptor Nests": layerRaptorNests,
    "Drawn Layers Feature Group": featureGroupDrawnItems
};

controlLayer = L.control.layers(baseLayers,  overlayLayers).addTo(map);

controlAttribute = L.control.attribution({position: "bottomleft"});
controlAttribute.addAttribution("<a href='http://geocadder.bg/en'>geocadder</a>");
controlAttribute.addTo(map);

controlStyle = L.control.styleEditor({position: 'topright'}).addTo(map);

controlDraw = new L.Control.Draw({
    draw: {
        circle:false
    },
    edit:{
        featureGroup:featureGroupDrawnItems
    }
});
controlDraw.addTo(map);

map.on('draw:created', function(e){
    console.log(e);
    featureGroupDrawnItems.addLayer(e.layer);
});

controlMousePosition = L.control.mousePosition();
controlMousePosition.addTo(map);

controlPolylineMeasure = L.control.polylineMeasure();
controlPolylineMeasure.addTo(map);

controlSidebar = L.control.sidebar('sidebar', {
    position: 'left'
});
controlSidebar.addTo(map);

controlEasyButtonSidebar = L.easyButton('glyphicon-transfer', function(){
    controlSidebar.toggle();
}).addTo(map);

map.on('contextmenu', function(e){
    L.marker(e.latlng).addTo(map).bindPopup(e.latlng.toString());
})

map.on('keypress',function(e){
    if(e.originalEvent.key == "l"){
        map.locate();
    }
})

map.on('locationfound', function(e){
    console.log(e);
    if(markerCurrentLocation){
        markerCurrentLocation.remove();
    }    
    markerCurrentLocation = L.circle(e.latlng, {radius:e.accuracy/2}).addTo(map);
    map.setView(e.latlng, 18);
})

map.on('locationerror', function(e){
    console.log(e);
    alert("Location  was not found");
})

map.on('zoomend', function(){
    $("#zoom-level").html(map.getZoom());
})

map.on('moveend', function(){
    $("#map-center").html(LatLngToArrayString(map.getCenter()));    
})

map.on('mousemove', function(e){
    $("#mouse-location").html(LatLngToArrayString(e.latlng));
})

$("#btnLocate").click(function(){
    map.locate();
})

function LatLngToArrayString(ll){
    return "[" + ll.lat.toFixed(5) + ", "  + ll.lng.toFixed(5) + "]";
}

function returnEagleMarker(geoJsonPoint, latlng){
    var attribute = geoJsonPoint.properties;
    if(attribute.status == 'ACTIVE NEST'){
        var colorNest = 'deeppink';
    } else {
        var colorNest = 'blue';
    }
    return L.circleMarker(latlng, {radius: 10, color:colorNest}).bindTooltip("<h4>Eagle Nest: " + attribute.nest_id + "<h4> Status: "  + attribute.status);
}

function returnRaptorMarker(geoJsonPoint, latlng){
    var attribute = geoJsonPoint.properties;
    switch(attribute.recentstatus){
        case 'ACTIVE NEST':
            var optionRaptor = {radius: 10, color:'deeppink', fillColor: 'blue', fillOpacity: 0.5};
            break;
        case 'INACTIVE NEST':
            var optionRaptor = {radius: 10, color:'blue', fillColor: 'blue', fillOpacity: 0.5};
            break;
        case 'FLEDGED NEST':
            var optionRaptor = {radius: 10, color:'blue', fillColor: 'blue', fillOpacity: 0.5, dashArray: "2,8"};
            break;
    }
    return L.circleMarker(latlng, optionRaptor).bindPopup("<h4>Raptor Nest: " + attribute.Nest_ID + "<h4> Status: "  + attribute.recentstatus + "<br>Species:  " + attribute.recentspecies + "Last Survey: " + attribute.lastsurvey);
}

// function returnRaptorMarker(geoJsonPoint, latlng){
//     var attribute = geoJsonPoint.properties;
    // if(attribute.status == 'ACTIVE NEST'){
    //     var colorNest = 'deeppink';
    // } else {
    //     var colorNest = 'lightgreen';
    // }
    // return L.circleMarker(latlng, {radius: 10, color:colorNest, fillColor: 'green', fillOpacity: 0.5}).bindTooltip("<h4>Eagle Nest: " + attribute.nest_id + "<h4> Status: "  + attribute.status);
// }

// function filterEagleNests (geoJsonFeature){
//     var attribute = geoJsonFeature.properties;
//     if(attribute.status == 'ACTIVE NEST'){
//         return true;
//     } else {
//         return false;
//     }
// }

