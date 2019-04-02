var map;
var layerOSM;
var layerWatercolor;
var layerTopo;
var layerImagery;
var layerOutdoors;
var markerCurrentLocation;
var markerClusterLayer;
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
var layerClientLines;
var layerBurrowingOwl;
var layerGreatBlueHeron;
// var iconRedSprite;
// var iconVioletSprite;
// var iconLeafletAwesomeMarkerTree;
// var iconLeafletAwesomeMarkerBird;
// var iconMapKeyTree;
// var iconMapKeyBird;
// var iconEagleActive;
// var iconEagleInactive;

// iconRedSprite = L.spriteIcon('red');
// iconVioletSprite = L.spriteIcon('violet');

// iconLeafletAwesomeMarkerTree = L.AwesomeMarkers.icon({icon: 'tree-conifer', markerColor: 'green'});
// iconLeafletAwesomeMarkerBird = L.AwesomeMarkers.icon({icon: 'twitter', markerColor: 'green', iconColor: 'red', spin: true,prefix: 'fa'});

// iconMapKeyBird = L.icon.mapkey({icon:"school",color:'#725139',background:'#f2c357',size:30});
// iconMapKeyTree = L.icon.mapkey({icon:"tree_cinofer",color:'#725139',background:'#f2c357',size:30, borderRadius: 5});

// iconEagleActive = L.icon({iconUrl: 'nest.png', iconSize: [30, 30],
// iconAnchor: [10, 20]});
// iconEagleInactive = L.icon({iconUrl: 'nest2.png', iconSize: [30, 30],
// iconAnchor: [10, 20]});

// iconEagleActive = L.icon({iconUrl:'../img/nest2.png', iconSize:[40,40], iconAnchor:[20,24]});
// iconEagleInactive = L.icon({iconUrl:'../img/nest.png', iconSize:[40,40], iconAnchor:[20,24]});







// *************** Map Initialization *************/

map = L.map('map', {center:[40.18, -104.83], zoom: 11, attributionControl: false});

controlSidebar = L.control.sidebar('sidebar', {
    position: 'left'
});
controlSidebar.addTo(map);

controlEasyButtonSidebar = L.easyButton('glyphicon-transfer', function(){
    controlSidebar.toggle();
}).addTo(map);

controlAttribute = L.control.attribution({position: "bottomleft"});
controlAttribute.addAttribution("<a href='http://geocadder.bg/en'>geocadder</a>");
controlAttribute.addTo(map);

controlMousePosition = L.control.mousePosition();
controlMousePosition.addTo(map);

controlScale = L.control.scale({position:  "bottomleft", imperial: false});
controlScale.addTo(map);

controlStyle = L.control.styleEditor({position: 'topright'}).addTo(map);

controlPolylineMeasure = L.control.polylineMeasure();
controlPolylineMeasure.addTo(map);
// ****************************************************




// ************* Layer Initialization *************/

// layerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
layerOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
layerWatercolor = L.tileLayer.provider('Stamen.Watercolor');
layerTopo = L.tileLayer.provider('OpenTopoMap');
layerImagery = L.tileLayer.provider('Esri.WorldImagery');
layerHydra = L.tileLayer.provider('Hydda.Full');
map.addLayer(layerOSM);
// *****************************************************


featureGroupDrawnItems = L.featureGroup().addTo(map);

// layerEagleNests = L.geoJSON.ajax('data/wildlife_eagle.geojson', {pointToLayer: returnEagleMarker, filter: filterEagleNests}).addTo(map);
// layerEagleNests.on('data:loaded', function(){
//     map.fitBounds(layerEagleNests.getBounds());
// })

layerEagleNests = L.geoJSON.ajax('data/wildlife_eagle.geojson', {pointToLayer: returnEagleMarker}).addTo(map);
layerEagleNests.on('data:loaded', function(){
    map.fitBounds(layerEagleNests.getBounds());
})

markerClusterLayer = L.markerClusterGroup({});

// layerRaptorNests = L.geoJSON.ajax('data/wildlife_raptor.geojson', {pointToLayer: returnRaptorMarker});
// layerRaptorNests.on('data:loaded', function(){
//     layerRaptorNests.addTo(map);
// })

layerRaptorNests = L.geoJSON.ajax('data/wildlife_raptor.geojson', {pointToLayer: returnRaptorMarker});
layerRaptorNests.on('data:loaded', function(){
    markerClusterLayer.addLayer(layerRaptorNests);
    markerClusterLayer.addTo(map);
})

layerClientLines = L.geoJSON.ajax('data/client_lines.geojson', {style: styleClientLinears, onEachFeature: processClientLinears}).addTo(map);

layerBurrowingOwl = L.geoJSON.ajax('data/wildlife_buowl.geojson', {style: styleBurrowingOwl, onEachFeature: processBurrowingOwl, filter: filterBurrowingOwl}).addTo(map);

layerGreatBlueHeron = L.geoJSON.ajax('data/wildlife_gbh.geojson', {style: {color: 'fuchsia'}}).bindTooltip("GBH Nesting Area").addTo(map);

// overlayLayers = {
//     "Eagle Nests": layerEagleNests,
//     "Raptor Nests": layerRaptorNests,
//     "Drawn Layers Feature Group": featureGroupDrawnItems
// };

// *************** Setup Layer Control ****************

baseLayers = {
    "Open Street Maps": layerOSM,
    "Watercolor": layerWatercolor,
    "Topo Map": layerTopo,
    "Imagery": layerImagery,
    "Hydra": layerHydra
};

overlayLayers = {
    "Client Linears": layerClientLines,
    "Burrowing Owl": layerBurrowingOwl,
    "Eagle Nests": layerEagleNests,
    "Raptor Nests": markerClusterLayer,
    "Great Blue Heron Rookeries": layerGreatBlueHeron,
    "Drawn Layers Feature Group": featureGroupDrawnItems
};

controlLayer = L.control.layers(baseLayers,  overlayLayers).addTo(map);
// ****************************************************


// *********** Setup Draw Control *************

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
// **********************************************






// map.on('contextmenu', function(e){
//     L.marker(e.latlng).addTo(map).bindPopup(e.latlng.toString());
// })

// map.on('keypress',function(e){
//     if(e.originalEvent.key == "l"){
//         map.locate();
//     }
// })



// ********* Location Events **********

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
// ***************************************






// map.on('zoomend', function(){
//     $("#zoom-level").html(map.getZoom());
// })

// map.on('moveend', function(){
//     $("#map-center").html(LatLngToArrayString(map.getCenter()));    
// })

// map.on('mousemove', function(e){
//     $("#mouse-location").html(LatLngToArrayString(e.latlng));
// })





// ************ jQuery Event Handlers ************

$("#btnLocate").click(function(){
    map.locate();
})
// ****************************************************



// **************** Eagle Functions **************

function returnEagleMarker(geoJsonPoint, latlng){
    var attribute = geoJsonPoint.properties;
    if(attribute.status == 'ACTIVE NEST'){
        var colorNest = 'deeppink';
    } else {
        var colorNest = 'green';
    }
    return L.circle(latlng, {radius: 804, color:colorNest}).bindTooltip("<h4>Eagle Nest: " + attribute.nest_id + "<h4> Status: "  + attribute.status);
}

// function returnEagleMarker(geoJsonPoint, latlng){
//     var attribute = geoJsonPoint.properties;
//     if(attribute.status == 'ACTIVE NEST'){
//         var iconEagle = iconRedSprite;
//     } else {
//         var iconEagle = iconVioletSprite;
//     }
//     return L.marker(latlng, {icon: iconEagle});
// }

// function returnEagleMarker(geoJsonPoint, latlng){
//     var attribute = geoJsonPoint.properties;
//     if(attribute.status == 'ACTIVE NEST'){
//         var iconEagle = iconLeafletAwesomeMarkerBird;
//     } else {
//         var iconEagle = iconLeafletAwesomeMarkerTree;
//     }
//     return L.marker(latlng, {icon: iconEagle});
// }

// function returnEagleMarker(geoJsonPoint, latlng){
//     var attribute = geoJsonPoint.properties;
//     if(attribute.status == 'ACTIVE NEST'){
//         var iconEagle = iconMapKeyBird;
//     } else {
//         var iconEagle = iconMapKeyTree;
//     }
//     return L.marker(latlng, {icon: iconEagle}).bindTooltip("<h4>Eagle Nest: " + attribute.nest_id + "<h4>");
// }

// function returnEagleMarker(geoJsonPoint, latlng){
//     var attribute = geoJsonPoint.properties;
//     if(attribute.status == 'ACTIVE NEST'){
//         var iconEagle = iconEagleActive;
//     } else {
//         var iconEagle = iconEagleInactive;
//     }
//     return L.marker(latlng, {icon: iconEagle}).bindTooltip("<h4>Eagle Nest: " + attribute.nest_id + "<h4>");
// }
// *************************************************************





// ************ Raptor Functions *************

function returnRaptorMarker(geoJsonPoint, latlng){
    var attribute = geoJsonPoint.properties;
    switch(attribute.recentspecies){
        case 'Red-tail Hawk':
            var radiusRaptor = 533;
            break;
        case 'Swainsons Hawk': 
            var radiusRaptor = 400;
            break;
        default: 
            var radiusRaptor = 804;
            break;
    }
    switch(attribute.recentstatus){
        case 'ACTIVE NEST':
            var optionRaptor = {radius: radiusRaptor, color:'deeppink', fillColor: 'blue', fillOpacity: 0.5};
            break;
        case 'INACTIVE NEST':
            var optionRaptor = {radius: radiusRaptor, color:'blue', fillColor: 'blue', fillOpacity: 0.5};
            break;
        case 'FLEDGED NEST':
            var optionRaptor = {radius: radiusRaptor, color:'deeppink', fillColor: 'blue', fillOpacity: 0.5, dashArray: "2,8"};
            break;
    }
    return L.circle(latlng, optionRaptor).bindPopup("<h4>Raptor Nest: " + attribute.Nest_ID + "<h4> Status: "  + attribute.recentstatus + "<br>Species:  " + attribute.recentspecies + "<br>Last Survey: " + attribute.lastsurvey);
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
// ******************************************************


// ************* Client Linears Functions ***************
function styleClientLinears(geoJsonFeature){
    var attribute = geoJsonFeature.properties;
    switch(attribute.type){
        case 'Pipeline': 
            return {color: 'peru'};
            break;
        case 'Flowline': 
            return {color: 'navy'};
            break;
        case 'Flowline, est.': 
            return {color: 'navy', dashArray: "5,5"};
            break;
        case 'Electric Line': 
            return {color: 'darkgreen'};
            break;
        case 'Access Road - Confirmed': 
            return {color: 'darkred'};
            break;
        case 'Access Road - Estimated': 
            return {color: 'darkred', dashArray: "5,5"};
            break;
        case 'Extraction': 
            return {color: 'indigo'};
            break;
        default:
            return {color: 'darkgoldenred'};
            break;
    }
}

function processClientLinears (feature, layer){
    var attribute = feature.properties;
    layer.bindTooltip("<h4>Linear Project: " + attribute.Project + "</h4></h4>Type: " + attribute.type + "</h4><br>Row width: " + attribute.row_width);
}
// **********************************************************



// ************** Burrowing Owl Functions *************

function styleBurrowingOwl(geoJsonFeature){
    var attribute = geoJsonFeature.properties;
    switch(attribute.hist_occup){
        case 'Yes': 
            return {color: 'deeppink', fillColor: 'yellow'};
            break;
        case 'Undetermined': 
            return {color: 'yellow'};
            break;
    }
}

function processBurrowingOwl (feature, layer){
    var attribute = feature.properties;
    layer.bindTooltip("<h4>Habitat ID: " + attribute.habitat_id + "</h4></h4>Historically Occupied: " + attribute.hist_occup + "</h4><br>Status: " + attribute.recentstatus);
}

function filterBurrowingOwl (geoJsonFeature){
    var attribute = geoJsonFeature.properties;
    if(attribute.recentstatus == 'REMOVED'){
        return false;
    } else {
        return true;
    }
}



// ************ General Functions *******************
function LatLngToArrayString(ll){
    return "[" + ll.lat.toFixed(5) + ", "  + ll.lng.toFixed(5) + "]";
}