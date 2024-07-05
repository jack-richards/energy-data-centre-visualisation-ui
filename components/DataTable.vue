<template>
    <UTable :rows="tableData" :columns="columns" />
</template>

<script setup>
    const config = useRuntimeConfig();

    const props = defineProps({
        tableName: String,
        fields: Array,
        round: Number,
    });

    const columns = props.fields.map(field => {
        return {
            key: field,
            label: field,
            sortable: true,
        };
    });

    const { data: tableData } = await useFetch(`${config.public.baseUrl}/tables/${props.tableName}`, {
        query: {
            fields: props.fields.join(","),
            dp: props.round,
        },
    });
</script>
