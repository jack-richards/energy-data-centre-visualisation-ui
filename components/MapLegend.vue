<template>
	<div class="legend">
		<h4>Legend</h4>
		<div v-for="(grade, index) in grades" :key="index" class="legend-scale">
			<div :style="{ backgroundColor: getColor(grade) }"></div>
			<span>{{ labels[index] }}</span>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import chroma from "chroma-js";

	const props = defineProps({
		minValue: Number,
		maxValue: Number,
		scaleColors: Array,
	});

	const colorScale = chroma.scale(props.scaleColors).domain([props.minValue, props.maxValue]);

	const grades = computed(() => {
		// Create an array of breakpoints for the legend, for example:
		const range = props.maxValue - props.minValue;
		const step = range / (props.scaleColors.length - 1);
		return [...Array(props.scaleColors.length)].map((_, i) => props.minValue + step * i);
	});

	const labels = computed(() => {
		return grades.value.map((grade, index) => {
			if (index === 0) return `${grade}+`;
			if (index === grades.value.length - 1) return `${grade}+`;
			return `${grades.value[index - 1]} - ${grade}`;
		});
	});

	const getColor = (value) => {
		return colorScale(value).hex();
	};
</script>

<style scoped>
	.legend {
		position: absolute;
		z-index: 999;
		top: 10px;
		right: 10px;
		padding: 6px 8px;
		font: 14px Arial, Helvetica, sans-serif;
		background: white;
		background: rgba(255, 255, 255, 0.8);
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
		border-radius: 5px;
		line-height: 24px;
		color: #555;
	}
	.legend h4 {
		text-align: center;
		margin-top: 0;
	}
	.legend-scale {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
	}
	.legend-scale div {
		width: 24px;
		height: 24px;
		margin-right: 6px;
	}
</style>
