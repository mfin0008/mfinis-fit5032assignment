<script setup>
import { getAllVenues } from "@/firebase/collections/venues";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ref, onMounted, onUnmounted } from "vue";

mapboxgl.accessToken = "pk.eyJ1IjoibWF0dGhld2ZpbmlzIiwiYSI6ImNtZ3NycGxpZTNjdHQybm92NHR2MjIwencifQ.X3Z2zFF2lcAKoyUS6D2mXQ";

const mapContainer = ref(null);
let map = null;
let venueLabel = null;

const DEFAULT_ZOOM = 10;
const DEFAULT_COORDS = { long: 144.9631, lat: -37.8136 };
const center = ref([DEFAULT_COORDS.long, DEFAULT_COORDS.lat]);

const selectedVenueId = defineModel('selectedVenueId', {default: null});
const clearSelectedVenue = () => {
  if (selectedVenueId.value) {
    map.setFeatureState({ source: 'pois', id: selectedVenueId.value }, { selected: false });
    selectedVenueId.value = null;
    venueLabel?.remove();
    venueLabel = null;
  }
};

const venues = ref([]);
const pointOfInterests = ref({ type: "FeatureCollection", features: [] });
const getPointsOfInterestJSON = () => ({
  type: "FeatureCollection",
  features: venues.value.map(venue => ({
    type: "Feature",
    properties: { name: venue.data.name, id: venue.id },
    geometry: { type: "Point", coordinates: [Number(venue.data.location.coords.longitude), Number(venue.data.location.coords.latitude)] }
  })),
});

const resetToCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    center.value = [position.coords.longitude, position.coords.latitude];
    map?.flyTo({ center: center.value, zoom: DEFAULT_ZOOM });
  });
}

onMounted(async () => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/mapbox/streets-v12",
    center: center.value,
    zoom: DEFAULT_ZOOM,
  });

  map.on("load", () => {
    map.addSource("pois", {
      type: "geojson",
      data: pointOfInterests.value,
      promoteId: "id"
    });

    map.addLayer({
      id: "pois-circle",
      type: "circle",
      source: "pois",
      paint: {
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "selected"], false], 15, 12
        ],
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false], "#22c55e", "#0ea5e9"
        ],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2
      }
    });

    map.addLayer({
      id: "pois-label",
      type: "symbol",
      source: "pois",
      layout: {
        "text-field": ["get", "name"],
        "text-offset": [0, 1.2],
        "text-size": 15,
        "text-anchor": "top"
      },
      paint: { "text-color": "#2b2b2b", "text-halo-color": "#ffffff", "text-halo-width": 1 }
    });

    map.on("click", "pois-circle", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const featureId = feature.id;
      if (!featureId) return;

      if (selectedVenueId.value === featureId) {
        clearSelectedVenue();
        return;
      }

      clearSelectedVenue();
      selectedVenueId.value = feature.id;
      map.setFeatureState({ source: "pois", id: feature.id }, { selected: true });

      const [lng, lat] = feature.geometry.coordinates;
      venueLabel?.remove();
      venueLabel = new mapboxgl.Popup({ offset: 10 })
        .setLngLat([lng, lat])
        .setHTML(`<strong>${feature.properties.name}</strong>`)
        .addTo(map);
    });
  });

  try {
    venues.value = await getAllVenues();
    pointOfInterests.value = getPointsOfInterestJSON();

    // wait for the map to finish loading
    await new Promise(resolve => map.once("load", resolve));
    clearSelectedVenue();
    map.getSource('pois').setData(pointOfInterests.value);
  } catch {
    alert('Oops! Something went wrong.');
  }
});

onUnmounted(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="text-center">
    <div ref="mapContainer" class="map-container"></div>
    <button class="btn btn-primary rounded-pill my-3" @click="resetToCurrentLocation">Find Nearby Venues</button>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
.map-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 25%;
  border: 4px solid var(--color-neutral);
  border-radius: 2rem;
}
</style>
