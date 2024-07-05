<template>
    <div class="page-container dark:bg-neutral-900 min-h-screen flex flex-col items-center justify-center">
        <div class="graph-container rounded shadow-md mb-8" ref="chartsContainer">
            <div v-for="option in selectedOptions">
                <template v-if="option === 'Table'">
                    <div class="w-[80vw] max-h-screen p-4 overflow-scroll" v-if="tableFields.length > 0">
                        <DataTable
                            table-name="Half-hourly_profiles_of_heating_technologies"
                            :key="selectedOutputConsumption"
                            :fields="tableFields"
                            :round="6"
                        />
                    </div>
                </template>
                <template v-else-if="option === 'Line Graph'">
                    <div v-if="chartTitle">
                        <LineGraph
                            :key="chartTitle"
                            :title="chartTitle"
                            :y-label="chartYAxisTitle"
                            :fields="chartFields"
                        />
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
                            v-model="selectedOutputConsumption"
                            :options="[
                                { value: 'output', label: 'Heat Output' },
                                { value: 'consumption', label: 'Fuel Consumption' },
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
                            @click="downloadCSV('Half-hourly_profiles_of_heating_technologies')"
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

    const chartTypes = ["Table", "Line Graph"];

    const chartTypesDowndownOpen = ref(true);
    const downloadDropbarOpen = ref(true);

    const selectedOptions = ref([]);

    const selectedOutputConsumption = ref(null);

    const chartFields = ref([]);
    const chartTitle = ref(null);
    const chartYAxisTitle = ref(null);

    const tableFields = ref([]);

    const chartsContainer = ref(null);

    async function downloadScreenshot() {
        const canvas = await html2canvas(chartsContainer.value);

        const uri = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = uri;
        link.click();
    }

    watch([selectedOutputConsumption, selectedOptions], async () => {
        // If any of the needed options are left null, return.
        if (!selectedOutputConsumption.value || !selectedOptions.value) {
            return;
        }

        for (const option of selectedOptions.value) {
            switch (option) {
                case "Line Graph":
                    switch (selectedOutputConsumption.value) {
                        case "output":
                            chartFields.value = [
                                "index",
                                "Normalised_Gas_boiler_heat",
                                "Normalised_Resistance_heater_heat",
                                "Normalised_ASHP_heat",
                                "Normalised_GSHP_heat",
                            ];
                            chartTitle.value = "Heat Output";
                            chartYAxisTitle.value = "Heat Output (GWh)";
                            break;
                        case "consumption":
                            chartFields.value = [
                                "index",
                                "Normalised_Gas_boiler_gas",
                                "Normalised_Resistance_heater_elec",
                                "Normalised_ASHP_elec",
                                "Normalised_GSHP_elec",
                            ];
                            chartTitle.value = "Fuel Consumption of different heating systems";
                            chartYAxisTitle.value = "Fuel Consumption (GWh)";
                            break;
                    }
                    break;
                case "Table":
                    switch (selectedOutputConsumption.value) {
                        case "output":
                            tableFields.value = [
                                "index",
                                "Normalised_Gas_boiler_heat",
                                "Normalised_Resistance_heater_heat",
                                "Normalised_ASHP_heat",
                                "Normalised_GSHP_heat",
                            ];
                            break;
                        case "consumption":
                            tableFields.value = [
                                "index",
                                "Normalised_Gas_boiler_gas",
                                "Normalised_Resistance_heater_elec",
                                "Normalised_ASHP_elec",
                                "Normalised_GSHP_elec",
                            ];
                            break;
                    }
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
