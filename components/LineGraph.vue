<template>
    <div ref="container"></div>
    <!-- <div id="overlay"></div> -->
    <div ref="tooltip" class="tooltip" style="opacity: 0"></div>
</template>

<script setup>
    //creating the graph
    import * as d3 from "d3";

    const config = useRuntimeConfig();

    const props = defineProps({
        fields: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        yLabel: {
            type: String,
            required: true,
        },
    });

    const container = ref(null);
    const tooltip = ref(null);

    //fetching the data from the API
    const { data } = await useFetch(`${config.public.baseUrl}/api/line-graph`, {
        query: {
            fields: props.fields.join(","),
        },
        transform: data => {
            data.index = data.index.map(value => new Date(value * 1000));
            return data;
        },
    });

    //using D3 to find the minimum and maximum values of the array.
    var minAndMax = data.value.minmax;

    onMounted(() => {
        // Declare the chart dimensions and margins.
        const width = 840;
        const height = 550;
        const svgHeight = 500;
        const svgWidth = 1000;
        const marginTop = 30;
        const marginRight = 20;
        const marginBottom = 170;
        const marginLeft = 50;

        const indexMinMax = d3.extent(data.value.index);

        // Declare the x (horizontal position) scale.
        const x = d3
            .scaleUtc()
            .domain(indexMinMax)
            .range([marginLeft, width - marginRight]);

        // Declare the y (vertical position) scale.
        const y = d3
            .scaleLinear()
            .domain(minAndMax)
            .range([height - marginBottom, marginTop]);

        //y.ticks(10);

        // Create the SVG container.
        const svg = d3.create("svg").attr("id", "d3-target").attr("width", svgWidth).attr("height", svgHeight);

        // Add the x-axis.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x));

        // Add the y-axis.
        svg.append("g").attr("transform", `translate(${marginLeft},0)`).call(d3.axisLeft(y));

        // Update the data domain
        x.domain(indexMinMax);
        y.domain(minAndMax);

        // get columns
        const columns = data.value.columns;

        const dataPoints = data.value.index.map((time, i) => {
            const point = { index: time };
            columns.forEach(column => {
                if (column !== "index") {
                    point[column] = data.value[column][i];
                }
            });
            return point;
        });

        const colors = ["red", "orange", "yellow", "green"];

        var index = 0;

        for (const column of columns) {
            // Skip the index column
            if (column === "index") {
                continue;
            }

            // Create the line generator
            const line = d3
                .line()
                .x(d => x(d.index))
                .y(d => y(d[column]));

            // Create the line path
            const linePath = line(dataPoints);

            // Add the line path to the SVG element
            svg.append("path").datum(dataPoints).attr("d", linePath).attr("stroke", colors[index++]);
        }

        //making the area under the graph transparent
        svg.style("fill", "transparent");

        const legend = svg
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - marginRight) + ",0)"); // Adjust the position as needed

        // Add legend
        legend
            .selectAll("legend")
            .data(columns.slice(1)) // Skip the index column
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            }) // Space out legend items
            .each(function (d, i) {
                const g = d3.select(this);

                // Add the color swatch
                g.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 10)
                    .attr("height", 10)
                    .style("fill", colors[i]);

                // Add the text label
                g.append("text")
                    .attr("x", 20) // Space the text 20px from the swatch
                    .attr("y", 10) // Vertically center text with swatch
                    .text(d) // Use the column name as the label
                    .style("font-size", "12px")
                    .attr("alignment-baseline", "middle")
                    .attr("fill", "black");
            });

        // Update the axes
        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        //adding a title
        const title = svg
            .append("text")
            //.attr("x", width / 2 - 110)
            .attr("y", marginTop / 2)
            .attr("fill", "black")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text(props.title);

        // Add x-axis title
        const xAxisTitle = svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 120) // Position below the x-axis
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle") // Center the text
            .text("(Date)");

        // Add y-axis title
        const yAxisTitle = svg
            .append("text")
            .attr("x", -height / 2)
            .attr("y", marginLeft / 2)
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle") // Center the text
            .attr("transform", "rotate(-90)") // Rotate the text 90 degrees anti clockwise
            .text(props.yLabel);

        // Select the tooltip element
        const tooltipSelection = d3.select(tooltip.value);

        // Add transparent rectangles for tooltip triggers
        dataPoints.forEach((dataPoint, i) => {
            // Create a group to hold the rectangle and attach data point index
            const tooltipTriggerGroup = svg.append("g").data([i]);

            tooltipTriggerGroup
                .append("rect")
                .attr("class", "overlay")
                .attr("x", x(dataPoint.index) - 5) // Center the rectangle on the data point
                .attr("y", y(d3.max(columns.slice(1).map(col => dataPoint[col]))) - 5) // Position at the highest value for this timestamp
                .attr("width", 10) // Width of the rectangle
                .attr("height", height - marginBottom - y(d3.min(columns.slice(1).map(col => dataPoint[col])))) // Height spans from the highest to lowest value
                .style("fill", "transparent") // Make the fill transparent
                .style("pointer-events", "all") // Ensure mouse events are captured
                .on("mouseover", (event, index) => {
                    tooltipSelection.transition().duration(200).style("opacity", 1);
                })
                .on("mousemove", (event, index) => {
                    const currentDataPoint = dataPoints[index];
                    let tooltipHtml = `Date: ${currentDataPoint.index.toLocaleDateString()}<br>`;
                    columns.slice(1).forEach((col, colIndex) => {
                        // Skip the index column
                        tooltipHtml += `${col}: ${currentDataPoint[col]}<br>`;
                    });
                    tooltipSelection
                        .html(tooltipHtml)
                        .style("left", event.pageX + 10 + "px")
                        .style("top", event.pageY + 10 + "px");
                })
                .on("mouseout", () => {
                    tooltipSelection.transition().duration(500).style("opacity", 0);
                });
        });

        // Add the SVG element to the DOM.
        d3.select(container.value).node().append(svg.node());
    });
</script>

<style scoped>
    .legend-item text {
        font: 10px sans-serif;
        pointer-events: none;
    }

    .legend-item rect {
        stroke-width: 2;
        stroke: #fff;
    }

    .tooltip {
        position: absolute;
        text-align: center;
        padding: 8px;
        font: 12px sans-serif;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
    }
</style>
