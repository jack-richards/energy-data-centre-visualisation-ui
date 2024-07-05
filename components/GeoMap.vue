<template v-once>
	<div style="height: 600px; width: 800px">
		<l-map :use-global-leaflet="false" v-model:zoom="zoom" :center="center">
			<l-tile-layer
				url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
				layer-type="base"
				name="OpenStreetMap"
			></l-tile-layer>
			<l-geo-json :geojson="mapData" :options="geoJsonOptions" />
			<map-legend :min-value="minValue" :max-value="maxValue" :scale-colors="['#2ca25f', '#fee08b', '#d73027']" />
		</l-map>
	</div>
</template>

<script setup>
	import "leaflet/dist/leaflet.css";
	import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
	import chroma from "chroma-js";

	const props = defineProps({
		mapName: String,
		lsoaField: String,
		center: Array,
		zoom: Number,
		sql: String,
	});

	const config = useRuntimeConfig();

	const { data: mapData, error } = await useFetch(`${config.public.baseUrl}/maps/${props.mapName}`, {
		query: {
			sql: props.sql,
			lsoa_field: props.lsoaField,
		},
	});

	var minValue = Infinity;
	var maxValue = -Infinity;

	for (var i = 1; i < mapData.value.features.length; i++) {
		var feature = mapData.value.features[i];
		var value = feature.properties["0"];
		if (value < minValue) {
			minValue = value;
		}
		if (value > maxValue) {
			maxValue = value;
		}
	}

	// Create a color scale using Chroma.js
	var colorScale = chroma.scale(["#2ca25f", "#fee08b", "#d73027"]).domain([minValue, maxValue]);

	const geoJsonOptions = {
		onEachFeature: (feature, layer) => {
			var text = `<table><tr><th>Key</th><th>Value</th></tr>`;
			for (var key in feature.properties) {
				text += `<tr><td>${mapData.value.features[0].properties[key]}</td><td>${feature.properties[key]}</td></tr>`;
			}
			text += "</table>";
			layer.bindPopup(text);
			layer.setStyle({
				fillColor: colorScale(feature.properties["0"]),
				fillOpacity: 0.75,
				color: "#000",
				weight: 1,
			});
		},
	};

	const zoom = ref(props.zoom);
</script>
