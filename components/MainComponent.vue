<template>
    <div class="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div class="rounded bg-white shadow-md mb-8">
            <div v-for="option in selectedOptions">
                <template v-if="option === 'Pie Chart'">
                    <PieChart
                        v-if="pieChartData"
                        :key="pieChartData.title"
                        :title="pieChartData.title"
                        :data="pieChartData.data"
                        :as-percentage="pieChartData.asPercentage"
                    />
                </template>
                <template v-else-if="option === 'Bar Chart'">
                    <BarChart
                        v-if="barChartData"
                        :key="barChartData.title"
                        :title="barChartData.title"
                        :data="barChartData.data"
                        :max="barChartData.max"
                        :legend="barChartData.legend"
                    />
                </template>
            </div>
        </div>

        <div class="flex items-start gap-x-4">
            <UCard :ui="{ base: '', body: { padding: chartTypesDowndownOpen ? 'px-4 py-5 sm:p-6' : 'px-4 sm:px-6' } }">
                <template #header>
                    <div class="flex gap-1">
                        <h2>Chart Types</h2>
                        <UToggle
                            class="ml-auto"
                            on-icon="i-heroicons-chevron-up"
                            off-icon="i-heroicons-chevron-down"
                            v-model="chartTypesDowndownOpen"
                        />
                    </div>
                </template>

                <div :class="{ 'h-0 overflow-hidden whitespace-nowrap': !chartTypesDowndownOpen }">
                    <div class="flex gap-x-2">
                        <URadioGroup
                            v-model="selectedBeforeAfter"
                            :options="[
                                { value: 'before', label: 'Before' },
                                { value: 'after', label: 'After' },
                            ]"
                        />

                        <URadioGroup
                            v-model="selectedHeatDwelling"
                            :options="[
                                { value: 'heating_type', label: 'Heating Type' },
                                { value: 'dwelling_type', label: 'Dwelling Type' },
                            ]"
                        />

                        <URadioGroup
                            v-model="selectedAverageSum"
                            :options="[
                                { value: 'average', label: 'Average' },
                                { value: 'sum', label: 'Sum' },
                            ]"
                        />

                        <USelectMenu
                            multiple
                            v-model="selectedOptions"
                            placeholder="Select Chart Types"
                            :options="chartTypes"
                        />
                    </div>
                </div>
            </UCard>

            <UCard>
                <template #header>
                    <div class="flex gap-1">
                        <h2>Download</h2>
                        <UToggle
                            class="ml-auto"
                            on-icon="i-heroicons-chevron-up"
                            off-icon="i-heroicons-chevron-down"
                            v-model="downloadDropbarOpen"
                        />
                    </div>
                </template>

                <div :class="{ 'h-0 overflow-hidden whitespace-nowrap': !downloadDropbarOpen }">
                    <div class="flex gap-x-2">
                        <UButton color="red" icon="i-heroicons-camera">Screenshot</UButton>
                        <UButton color="blue" icon="i-heroicons-arrow-down-tray">Download</UButton>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();

    const chartTypes = ["Pie Chart", "Bar Chart", "Line Graph", "Table", "Geographical Map"];

    const chartTypesDowndownOpen = ref(true);
    const downloadDropbarOpen = ref(true);

    const selectedOptions = ref([]);

    const selectedBeforeAfter = ref(null);
    const selectedHeatDwelling = ref(null);
    const selectedAverageSum = ref(null);

    const pieChartData = ref(null);
    const barChartData = ref(null);

    const chartsJson = ref(null);

    watch([selectedBeforeAfter, selectedHeatDwelling, selectedOptions, selectedAverageSum], async () => {
        // If any of the needed options are left null, return.
        if (
            !selectedBeforeAfter.value ||
            !selectedHeatDwelling.value ||
            !selectedOptions.value ||
            !selectedAverageSum.value
        ) {
            return;
        }

        var chartData = [];
        var title = "";
        // TODO should probably be toggleable in UI.
        const asPercentage = false;

        if (selectedOptions.value.includes("Pie Chart") || selectedOptions.value.includes("Bar Chart")) {
            const key = `${selectedHeatDwelling.value}:${selectedBeforeAfter.value}`;

            // Don't fetch chartdata unnecessarily.
            if (chartsJson.value == null || !chartsJson.value[key]) {
                // Specific data we want to fetch from the API.
                // The API selects the 'after' or 'before' data based on the 'rows' field.
                // The 'filter' field is used to understand what column data we want to use in the calculations.
                const data_required = [{ filter: selectedHeatDwelling.value, rows: selectedBeforeAfter.value }];

                // Populate title and data variables.
                const { data: jsonData } = await useFetch(`${config.public.baseUrl}/api/Annual_heat_demand_LSOA`, {
                    method: "post",
                    body: data_required,
                    transform: response => {
                        for (const key in response) {
                            for (const item of response[key]["sum"]) {
                                // In this instance we know the sum is in kilowatt hours.
                                // Convert each sum to gigawatt hours from kilowatt hours.
                                item[1] = item[1] / 1000000;
                            }
                        }
                        // Array of objects containing the data for each chart.
                        return response;
                    },
                });

                // Check if no data returned by API.
                if (!jsonData || !jsonData.value) {
                    console.error("No data returned by API");
                    return;
                }

                chartsJson.value = jsonData.value;
            }

            // Titles for graphs need to reflect which metric is being displayed.
            if (selectedAverageSum.value === "average") {
                chartData = chartsJson.value[key]["average"];
            } else if (selectedAverageSum.value === "sum") {
                chartData = chartsJson.value[key]["sum"];
            }

            title = `Breakdown of ${selectedAverageSum.value === "average" ? "average" : "overall"} heat demand per ${
                selectedHeatDwelling.value === "heating_type" ? "heating technology" : "dwelling type"
            } ${selectedBeforeAfter.value} energy efficiency improvements ${asPercentage ? "(%)" : "(GWh)"}`;
        }

        for (const option of selectedOptions.value) {
            switch (option) {
                case "Pie Chart":
                    // TODO: skip updates if selectedOptions was changed, but contains Pie Chart previously.
                    pieChartData.value = {
                        title: title,
                        data: chartData,
                        asPercentage,
                    };
                    break;
                case "Bar Chart":
                    // Wasn't sure what to put for the legend.
                    barChartData.value = {
                        title: title,
                        data: { datasets: [chartData] },
                        max: Infinity,
                        legend: [
                            selectedHeatDwelling.value === "heating_type" ? "Heating Technology" : "Dwelling Type",
                        ],
                    };
                    break;
                case "Line Graph":
                    break;
                case "Table":
                    break;
                case "Geographical Map":
                    break;
            }
        }
    });
</script>
