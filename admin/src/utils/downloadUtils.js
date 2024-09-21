export const downloadCSV = (records) => {
    const headers = ['No', 'Date', 'Details', 'Income', 'Expenses', 'Profit'];
    const rows = records.map((record, index) => [
        index + 1,
        new Date(record.date).toLocaleDateString(),
        record.details,
        record.income,
        record.expenses,
        record.profit,
    ]);

    const csvContent = [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "income_expenditure_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
