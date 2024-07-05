<template>
    <!-- This styling needs adjusting, I had to do this to make the graph display in a sensible way. -->
    <div style="height: 50rem; width: 60rem">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, Colors, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const props = defineProps({
    title: String,
    data: Object,
    max: Number,
    legend: Object
});

// Register.
ChartJS.register(Title, Tooltip, Legend, Colors, ChartDataLabels, CategoryScale, LinearScale, BarElement);

const title = props.title;
const datasets = props.data.datasets;
const legend = props.legend;

// Set used to store labels. By using a set, duplicate labels are not included.
var labels = new Set();

if (datasets.length == 0) {
    throw new Error("No data found for bar chart to render.");
}

const dataset_values = [];

// Loop through a single or multiple datasets, construct datasets object for the chart.
// If multiple datasets are present a clustered bar chart will ultimately be created.
for (const dataset of datasets) {
    const data_from_individual_dataset = [];
    for (const data of dataset) {
        // Capitalise first letter of label.
        let label = data[0].charAt(0).toUpperCase() + data[0].slice(1);
        labels.add(label);
        // Round data-point to 2 decimal places. TODO. ask client whether this is appropriate.
        data[1] = Math.round((data[1] + Number.EPSILON) * 100) / 100;
        // Push array of values from one dataset into datasets array.
        data_from_individual_dataset.push(data[1]);
    }
    // Push array of different values from one dataset into overall datasets array.
    dataset_values.push(data_from_individual_dataset);
}

let datasets_chart_array = [];
// For each dataset to render, create a object that contains a data field
// with the value of the array of values for that dataset. Then push this object
// into the datasets_chart_array.
for (let i = 0; i < datasets.length; i++) {
    let object = {};
    object.data = dataset_values[i];
    // Set the label to the legend value at the same index.
    object.label = legend[i];
    datasets_chart_array.push(object);
}

// Convert set to array. This is required for the chart to render.
labels = Array.from(labels);

const chartData = ref({
    labels: labels,
    datasets: datasets_chart_array
})

var chartOptions = ref({
    type: 'bar',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        colors: {
            enabled: true
        },
        legend: {
            enabled: true,
            position: 'bottom',
        },
        title: {
            display: true,
            text: title
        },
        datalabels: {
            align: 'center',
            font: {
                weight: 'bold',
                size: 14
            }
        }
    }
})

</script>