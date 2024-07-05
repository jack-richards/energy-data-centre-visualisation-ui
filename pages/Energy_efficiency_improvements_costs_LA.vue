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
                <template v-else-if="option === 'Table'">
                    <div class="w-[80vw] max-h-screen p-4 overflow-scroll" v-if="tableFields.length > 0">
                        <DataTable table-name="Energy_efficiency_improvements_costs_LA" :fields="tableFields" />
                    </div>
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
                            @click="downloadCSV('Energy_efficiency_improvements_costs_LA')"
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

    const chartTypes = ["Pie Chart", "Bar Chart", "Table"];

    const chartTypesDowndownOpen = ref(true);
    const downloadDropbarOpen = ref(true);

    const selectedOptions = ref([]);

    const selectedHeatDwelling = ref(null);
    const selectedAverageSum = ref(null);

    const SelectDownloadSnippet = ref(null);

    const pieChartData = ref(null);
    const barChartData = ref(null);

    const tableFields = [
        "Local Authority (2019)",
        "Average energy efficiency improvements costs of detached gas boiler (GBP)",
        "Average energy efficiency improvements costs of detached oil boiler (GBP)",
        "Average energy efficiency improvements costs of detached resistance heating (GBP)",
        "Average energy efficiency improvements costs of detached biomass boiler (GBP)",
        "Average energy efficiency improvements costs of flat gas boiler (GBP)",
        "Average energy efficiency improvements costs of flat oil boiler (GBP)",
        "Average energy efficiency improvements costs of flat resistance heating (GBP)",
        "Average energy efficiency improvements costs of flat biomass boiler (GBP)",
        "Average energy efficiency improvements costs of semi-detached gas boiler (GBP)",
        "Average energy efficiency improvements costs of semi-detached oil boiler (GBP)",
        "Average energy efficiency improvements costs of semi-detached resistance heating (GBP)",
        "Average energy efficiency improvements costs of semi-detached biomass boiler (GBP)",
        "Average energy efficiency improvements costs of terraced gas boiler (GBP)",
        "Average energy efficiency improvements costs of terraced oil boiler (GBP)",
        "Average energy efficiency improvements costs of terraced resistance heating (GBP)",
        "Average energy efficiency improvements costs of terraced biomass boiler (GBP)",
        "Number of detached gas boiler in 2018",
        "Number of detached resistance heating in 2018",
        "Number of detached oil boiler in 2018",
        "Number of detached biomass boiler in 2018",
        "Number of semi-detached gas boiler in 2018",
        "Number of semi-detached resistance heating in 2018",
        "Number of semi-detached oil boiler in 2018",
        "Number of semi-detached biomass boiler in 2018",
        "Number of terraced gas boiler in 2018",
        "Number of terraced resistance heating in 2018",
        "Number of terraced oil boiler in 2018",
        "Number of terraced biomass boiler in 2018",
        "Number of flat gas boiler in 2018",
        "Number of flat resistance heating in 2018",
        "Number of flat oil boiler in 2018",
        "Number of flat biomass boiler in 2018",
        "Total energy efficiency improvements costs (GBP)",
    ];

    const chartsContainer = ref(null);

    async function downloadScreenshot() {
        const canvas = await html2canvas(chartsContainer.value);

        const uri = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = uri;
        link.click();
    }

    watch([selectedHeatDwelling, selectedOptions, selectedAverageSum], async () => {
        // If any of the needed options are left null, return.
        if (!selectedHeatDwelling.value || !selectedOptions.value || !selectedAverageSum.value) {
            return;
        }

        // Specific data we want to fetch from the API.
        // The API selects the 'after' or 'before' data based on the 'rows' field.
        // The 'filter' field is used to understand what column data we want to use in the calculations.
        const data_required = [{ filter: selectedHeatDwelling.value }];

        // Populate title and data variables.
        const { data: jsonData } = await useFetch(
            `${config.public.baseUrl}/api/Energy_efficiency_improvements_costs_LA`,
            {
                method: "post",
                body: data_required,
                transform: response => {
                    for (const key in response) {
                        for (const item of response[key]["sum"]) {
                            // Convert each sum to millions.
                            item[1] = item[1] / 1000000;
                        }
                    }
                    // Array of objects containing the data for each chart.
                    return response;
                },
            },
        );

        // Check if no data returned by API.
        if (!jsonData || !jsonData.value) {
            return;
        }

        var chartData = [];
        var title = "";
        // TODO should probably be toggleable in UI.
        const asPercentage = false;

        // Titles for graphs need to reflect which metric is being displayed.
        if (selectedAverageSum.value === "average") {
            chartData = jsonData.value[`${selectedHeatDwelling.value}`]["average"];
            title = `Breakdown of average energy efficiency improvement costs per ${
                selectedHeatDwelling.value === "heating_type" ? "heating technology" : "dwelling type"
            } ${asPercentage ? "(%)" : "(£)"}`;
        } else if (selectedAverageSum.value === "sum") {
            chartData = jsonData.value[`${selectedHeatDwelling.value}`]["sum"];
            title = `Breakdown of overall energy efficiency improvement costs per ${
                selectedHeatDwelling.value === "heating_type" ? "heating technology" : "dwelling type"
            } ${asPercentage ? "(%)" : "(£Million)"}`;
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

<style scoped>
    .combined-container {
        display: flex;
        text-align: center;
        align-items: center;
    }

    .option-container {
        display: flex;
        align-items: center;
        @apply pb-1;
    }

    .thistext {
        margin-right: -65px;
        align-items: left;
    }

    .heat-container {
        display: flex;
        align-items: center;
    }

    .icon {
        margin-left: 10px;
        margin-top: px;
    }

    .anothericon {
        margin-left: 1px;
        margin-top: px;
    }

    .another-cotainer {
        position: relative;
        top: 1200px;
    }

    .download-snippet-options,
    .before-after-options,
    .heat-cold-options {
        top: 100%;
        left: 0;
        padding: 0.75rem;
        border-radius: 0.375rem;
        background-color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .before-after-options input[type="radio"],
    .download-snippet-options input[type="radio"],
    .heat-cold-options input[type="radio"] {
        display: none;
    }

    .download-snippet-options label,
    .before-after-options label,
    .heat-cold-options label {
        cursor: pointer;
        padding: 0.75rem;
        width: 100%;
        border: 1px solid #e2e8f0;
        border-radius: 0.25rem;
    }

    .download-snippet-options input[type="radio"]:checked + label,
    .before-after-options input[type="radio"]:checked + label,
    .heat-cold-options input[type="radio"]:checked + label {
        background-color: #ced4d8;
        color: white;
    }

    .length-checkit-options {
        width: 660px;
    }

    .length-download-options {
        height: 52px;
        width: 210px;
    }
</style>
