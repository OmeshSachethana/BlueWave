export const downloadCSV = (records) => {
    const headers = ['No', 'Date', 'Details', 'Income', 'Expenses', 'Profit/Loss']; // Added 'Profit/Loss'
    
    // Calculate totals
    const { totalIncome, totalExpenses, totalProfitLoss } = records.reduce((totals, record) => {
        const income = record.income || 0;
        const expenses = record.expenses || 0;
        return {
            totalIncome: totals.totalIncome + income,
            totalExpenses: totals.totalExpenses + expenses,
            totalProfitLoss: totals.totalProfitLoss + (income - expenses), // Calculate profit/loss for the total
        };
    }, { totalIncome: 0, totalExpenses: 0, totalProfitLoss: 0 });

    const rows = records.map((record, index) => [
        index + 1,
        new Date(record.date).toLocaleDateString(),
        record.details,
        record.income,
        record.expenses,
        //record.income - record.expenses // Calculate 'Profit/Loss' for each record
    ]);

    // Add totals row at the end
    rows.push(['', '', 'Total', totalIncome, totalExpenses, totalProfitLoss]);

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
