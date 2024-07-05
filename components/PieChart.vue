<template>
    <div>
      <Pie
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </template>
<script setup>
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, Colors } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'vue-chartjs';

// Register
ChartJS.register(ArcElement, Title, Tooltip, Legend, Colors, ChartDataLabels);

const props = defineProps({
    title: String,
    data: Object,
    asPercentage: Boolean 
});

// Take title and JSON data passed into the component.
const title = props.title;
const jsonData = props.data;

const data = [];
const labels = [];

if(!jsonData) {
  throw new Error("No data found for pie chart to render.");
}

if(props.asPercentage) {
  var sum = 0;

  jsonData.forEach((item) => {
    sum += item[1];
  });

  for (const item of jsonData) {
    let percentage = (item[1] / sum) * 100;
    percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;
    data.push(percentage);
    // Capitalise first letter of label.
    let label = item[0].charAt(0).toUpperCase() + item[0].slice(1);
    labels.push(label);
  }
} else {
  for (const item of jsonData) {
    // Round to 2 decimal places. TODO. ask client whether this is appropriate.
    item[1] = Math.round((item[1] + Number.EPSILON) * 100) / 100;
    data.push(item[1]);
    // Capitalise first letter of label.
    let label = item[0].charAt(0).toUpperCase() + item[0].slice(1);
    labels.push(label);
  }
}

const chartData = ref({
  labels,
  datasets: [
    {
      data
    },
  ],
})

var chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      colors: {
        enabled : true
      },
      legend: {
        enabled : true,
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

if(props.asPercentage) {
  chartOptions.value.plugins.datalabels = {
    align: 'center',
    formatter: function(value) {
      return value + '%';
    },
    font: {
      weight: 'bold',
      size: 14
    }
  }

  chartOptions.value.plugins.tooltip = {
    callbacks: {
      label: function(tooltipItem) {
        var value = tooltipItem.parsed;
        let label = value + "%";
        return label;
      }
    }
  }
}
</script>