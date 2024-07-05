<template>
    <div class="flex items-center justify-center">
        <svg id="pie-chart-container" width="400" height="500"></svg>
    </div>
</template>

<script setup>
import * as d3 from "d3";

const json = await useFetch("http://127.0.0.1:8000/api/piechart/");
const data = json.data.value;

const column_names = ["gas boiler", "oil boiler", "resistance heating", "biomass boiler"]

// Mounted
onMounted(() => {
    // If there is no data, do nothing.
    if (!data) {
        return;
    }
    //    Update the pie chart
    var angleGen = d3.pie()
        .value((d) => d[1]);

    var graphData = angleGen(data);

    var arcGen = d3.arc()
        .innerRadius(0)
        .outerRadius(90);

    var colorScale = d3.scaleOrdinal(["red", "green", "blue", "purple"]);

    d3.select("#pie-chart-container")
        .append("g")
        .attr("transform", "translate(100,100)");

    d3.select("#pie-chart-container g")
        .selectAll("path")
        .data(graphData)
        .enter()
        .append("path")
        .attr("d", arcGen)
        .attr("fill", (d) => colorScale(d))
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    // Adding legend 

    var color = d3.scaleOrdinal().domain(column_names).range(["red", "green", "blue", "purple"]);
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");

    // Add one dot in the legend for each name.
    var size = 20;

    // Create a group for the legend
    var legendGroup = d3.select("#pie-chart-container").append("g").attr("transform", "translate(200,20)");

    legendGroup
        .selectAll("mydots")
        .data(column_names)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function (data, i) {
            return i * (size + 5);
        })
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (data) {
            return color(data);
        })
        .style("outline", "black");

    // Add one dot in the legend for each name.
    legendGroup
        .selectAll("mylabels")
        .data(column_names)
        .enter()
        .append("text")
        .attr("x", size * 1.2)
        .attr("y", function (data, i) {
            return i * (size + 5) + size / 2;
        })
        .style("fill", "black")
        .text(function (data) {
            return data;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    // Add a title to the chart
    d3.select("#pie-chart-container")
        .append("text")
        .attr("y", 10) // Adjust the y-coordinate as needed
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Average Energy Efficiency Improvement Costs For Heating Technologies");


    function handleMouseOver(event, d) {
        // Show tooltip with data information
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
            .html(`${d.data[0]}: ${d.data[1]}`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
    }

    function handleMouseOut(event, d) {
        // Restore the color of the slice on mouse out
        d3.select(event.target).attr("fill", colorScale(d.data[0]));
    }
});
</script>
