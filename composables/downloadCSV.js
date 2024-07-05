export const downloadCSV = csvName => {
    const config = useRuntimeConfig();
    const a = document.createElement("a");
    a.href = `${config.public.baseUrl}/api/download-csv?csv_name=${csvName}`;
    a.click();
};
