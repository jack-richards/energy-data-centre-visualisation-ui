<template>
	<div class="flex">
		<div>
			<h2 class="text-2xl">Total heat demand before energy efficiency measures (MWh)</h2>
			<GeoMap
				map-name="Annual_heat_demand_LSOA"
				lsoa-field="LSOA11CD"
				:center="[53, -1.3]"
				:zoom="6.5"
				sql='SELECT geometry, (("Average heat demand before energy efficiency measures for detached biomass boiler (kWh)" + "Average heat demand before energy efficiency measures for detached gas boiler (kWh)" + "Average heat demand before energy efficiency measures for detached oil boiler (kWh)" + "Average heat demand before energy efficiency measures for detached resistance heating (kWh)" + "Average heat demand before energy efficiency measures for flat biomass boiler (kWh)" + "Average heat demand before energy efficiency measures for flat gas boiler (kWh)" + "Average heat demand before energy efficiency measures for flat oil boiler (kWh)" + "Average heat demand before energy efficiency measures for flat resistance heating (kWh)" + "Average heat demand before energy efficiency measures for semi-detached biomass boiler (kWh)" + "Average heat demand before energy efficiency measures for semi-detached gas boiler (kWh)" + "Average heat demand before energy efficiency measures for semi-detached oil boiler (kWh)" + "Average heat demand before energy efficiency measures for semi-detached resistance heating (kWh)" + "Average heat demand before energy efficiency measures for terraced biomass boiler (kWh)" + "Average heat demand before energy efficiency measures for terraced gas boiler (kWh)" + "Average heat demand before energy efficiency measures for terraced oil boiler (kWh)" + "Average heat demand before energy efficiency measures for terraced resistance heating (kWh)") / 1000) AS "Total heat demand before energy efficiency measures (MWh)", "Local Authority (2019)" as "Local Authority" FROM frame'
			/>
		</div>

		<div>
			<h2 class="text-2xl">Total heat demand after energy efficiency measures (MWh)</h2>
			<GeoMap
				map-name="Annual_heat_demand_LSOA"
				lsoa-field="LSOA11CD"
				:center="[53, -1.3]"
				:zoom="6.5"
				sql='SELECT geometry, (("Average heat demand after energy efficiency measures for detached biomass boiler (kWh)" + "Average heat demand after energy efficiency measures for detached gas boiler (kWh)" + "Average heat demand after energy efficiency measures for detached oil boiler (kWh)" + "Average heat demand after energy efficiency measures for detached resistance heating (kWh)" + "Average heat demand after energy efficiency measures for flat biomass boiler (kWh)" + "Average heat demand after energy efficiency measures for flat gas boiler (kWh)" + "Average heat demand after energy efficiency measures for flat oil boiler (kWh)" + "Average heat demand after energy efficiency measures for flat resistance heating (kWh)" + "Average heat demand after energy efficiency measures for semi-detached biomass boiler (kWh)" + "Average heat demand after energy efficiency measures for semi-detached gas boiler (kWh)" + "Average heat demand after energy efficiency measures for semi-detached oil boiler (kWh)" + "Average heat demand after energy efficiency measures for semi-detached resistance heating (kWh)" + "Average heat demand after energy efficiency measures for terraced biomass boiler (kWh)" + "Average heat demand after energy efficiency measures for terraced gas boiler (kWh)" + "Average heat demand after energy efficiency measures for terraced oil boiler (kWh)" + "Average heat demand after energy efficiency measures for terraced resistance heating (kWh)") / 1000) AS "Total heat demand after energy efficiency measures (MWh)", "Local Authority (2019)" as "Local Authority" FROM frame'
			/>
		</div>
	</div>
</template>
