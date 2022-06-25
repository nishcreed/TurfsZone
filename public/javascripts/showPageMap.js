
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', 
center: campground.geometry.coordinates, 
zoom: 10 
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(turf.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
            .setHTML(
            `<h3>${turf.title}</h3><p>${turf.location}</p>`
            )
    )
    .addTo(map)
