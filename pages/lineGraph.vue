<template>
	<LineGraph
		:fields="[
			'index',
			'Normalised_Gas_boiler_heat',
			'Normalised_Resistance_heater_heat',
			'Normalised_ASHP_heat',
			'Normalised_GSHP_heat',
		]"
		title="Heat Output"
		y-label="Heat Output (GWh)"
	/>

	<LineGraph
		:fields="[
			'index',
			'Normalised_Gas_boiler_gas',
			'Normalised_Resistance_heater_elec',
			'Normalised_ASHP_elec',
			'Normalised_GSHP_elec',
		]"
		title="Fuel Consumption of different heating systems"
		y-label="Fuel Consumption (GWh)"
	/>
</template>

<script setup>
	import LineGraph from "@/components/LineGraph.vue";
</script>
