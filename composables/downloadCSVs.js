export const downloadCSVs = csvs => {
    csvs.forEach((csv, i) => {
        setTimeout(() => {
            downloadCSV(csv);
            console.log(`Downloaded ${csv}`);
        }, i * 2000);
    });
};
