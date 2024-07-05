<template>
    <div class="page-container dark:bg-neutral-900 min-h-screen flex flex-col items-center justify-center">
        <div class="graph-container rounded shadow-md mb-8" ref="chartsContainer">
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
                            v-model="selectedBeforeAfterBoth"
                            :options="[
                                { value: 'before', label: 'Before' },
                                { value: 'after', label: 'After' },
                                { value: 'both', label: 'Both' },
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
                        <UButton color="red" icon="i-heroicons-camera" @click="downloadScreenshot">Screenshot</UButton>
                        <UButton
                            color="blue"
                            icon="i-heroicons-arrow-down-tray"
                            @click="
                                downloadCSVs(['Thermal_characteristics_afterEE', 'Thermal_characteristics_beforeEE'])
                            "
                            >Download</UButton
                        >
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>

<script setup>
    import html2canvas from "html2canvas";

    const config = useRuntimeConfig();

    const chartTypes = ["Pie Chart", "Bar Chart"];

    const chartTypesDowndownOpen = ref(true);
    const downloadDropbarOpen = ref(true);

    const selectedOptions = ref([]);

    const selectedBeforeAfterBoth = ref(null);
    const selectedHeatDwelling = ref(null);
    const selectedAverageSum = ref(null);

    const SelectDownloadSnippet = ref(null);

    const pieChartData = ref(null);
    const barChartData = ref(null);

    const chartsContainer = ref(null);

    async function downloadScreenshot() {
        const canvas = await html2canvas(chartsContainer.value);

        const uri = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = uri;
        link.click();
    }

    watch([selectedBeforeAfterBoth, selectedHeatDwelling, selectedAverageSum, selectedOptions], async () => {
        // If any of the needed options are left null, return.
        if (
            !selectedBeforeAfterBoth.value ||
            !selectedHeatDwelling.value ||
            !selectedOptions.value ||
            !selectedAverageSum.value
        ) {
            return;
        }

        // Specific data we want to fetch from the API.
        // The API selects the 'after' or 'before' data based on the 'rows' field.
        // The 'filter' field is used to understand what column data we want to use in the calculations.
        // The 'metric' field is used to understand what metric we want to have returned, e.g. mean or sum.
        const data_required = [
            {
                filter: selectedHeatDwelling.value,
                rows: selectedBeforeAfterBoth.value,
                metric: selectedAverageSum.value,
            },
        ];

        const { data: jsonData } = await useFetch(`${config.public.baseUrl}/api/Thermal_characteristics`, {
            method: "post",
            body: data_required,
            transform: response => {
                for (const key in response) {
                    const sumArrays = response[key]["sum"];

                    if (sumArrays && Array.isArray(sumArrays) && sumArrays.length >= 2) {
                        console.log(`Processing key: ${key}`);

                        sumArrays.forEach((datasetSumArray, index) => {
                            console.log(`Dataset ${index + 1}:`);

                            console.log("Original array:", datasetSumArray);

                            function fixItem(array) {
                                for (var i = 0; i < array.length; i++) {
                                    const item = array[i];

                                    // Check if the value is a valid number before division
                                    if (typeof item === "number" && !isNaN(item)) {
                                        // In this instance, we know the sum is in kilowatt hours.
                                        // Convert each sum to gigawatt hours from kilowatt hours.
                                        array[i] = item / 1000000;
                                        console.log("Transformed value:", array[i]);
                                    } else if (Array.isArray(item)) {
                                        fixItem(item);
                                    } else {
                                        console.log("Invalid value:", item);
                                    }
                                }
                            }

                            fixItem(datasetSumArray);

                            console.log("Transformed array:", datasetSumArray);
                        });
                    } else {
                        console.log(`Invalid or missing 'sum' array for key: ${key}`);
                    }
                }
                // Array of objects containing the data for each chart.
                return response;
            },
        });

        // Check if no data returned by API.
        if (!jsonData || !jsonData.value) {
            return;
        }

        var chartData = [];
        var title = "";
        // TODO should probably be toggleable in UI.
        const asPercentage = false;

        // Titles for graphs need to reflect which metric is being displayed.
        if (selectedBeforeAfterBoth.value !== "both") {
            // If not both, then we just need to get the data for the selected before/after.
            chartData =
                jsonData.value[`${selectedHeatDwelling.value}:${selectedBeforeAfterBoth.value}`][
                    selectedAverageSum.value
                ];
            if (selectedAverageSum.value === "average") {
                title = `Annual heat demand per ${
                    selectedHeatDwelling.value === "heating_type" ? "heating technology" : "dwelling type"
                } ${selectedBeforeAfterBoth.value} energy efficiency improvements ${asPercentage ? "(%)" : "(kWh)"}`;
            } else if (selectedAverageSum.value === "sum") {
                title = `Breakdown of overall heat demand per ${
                    selectedHeatDwelling.value === "heating_type" ? "heating technology" : "dwelling type"
                } ${selectedBeforeAfterBoth.value} energy efficiency improvements ${asPercentage ? "(%)" : "(GWh)"}`;
            }
            for (const option of selectedOptions.value) {
                switch (option) {
                    case "Pie Chart":
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
        } else if (selectedBeforeAfterBoth.value === "both") {
            if (selectedAverageSum.value === "average") {
                title = `Annual heat demand per ${
                    selectedHeatDwelling.value === "heating_type" ? "heating technology" : "dwelling type"
                } before & after energy efficiency improvements ${asPercentage ? "(%)" : "(kWh)"}`;
            } else if (selectedAverageSum.value === "sum") {
                title = `Breakdown of overall heat demand per ${
                    selectedHeatDwelling.value === "heating_type" ? "heating technology" : "dwelling type"
                } before & after energy efficiency improvements ${asPercentage ? "(%)" : "(GWh)"}`;
            }
            // Just do clustured bar chart.
            var chart_datasets =
                jsonData.value[`${selectedHeatDwelling.value}:${selectedBeforeAfterBoth.value}`][
                    selectedAverageSum.value
                ];
            for (const option of selectedOptions.value) {
                switch (option) {
                    case "Bar Chart":
                        // Wasn't sure what to put for the legend.
                        barChartData.value = {
                            title: title,
                            data: { datasets: chart_datasets },
                            max: Infinity,
                            legend: ["Before", "After"],
                        };
                        break;
                }
            }
        }
    });
</script>

<style></style>
