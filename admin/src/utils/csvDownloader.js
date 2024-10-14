// utils/csvDownloader.js

export const downloadCSV = (filteredEntries) => {
    const headers = [
      "Receipt", 
      "Date", 
      "Details", 
      "Voucher Number", 
      "Total", 
      "Office Expense", 
      "Travelling Expense", 
      "Cleaning Expense", 
      "Sundry Expense"
    ];
  
    // Convert entries to CSV format
    const rows = filteredEntries.map(entry => [
      entry.receipt,
      new Date(entry.date).toLocaleDateString(),
      entry.details,
      entry.voucherNumber,
      entry.total,
      entry.officeExpense,
      entry.vanExpense,
      entry.cleaningExpense,
      entry.sundryExpense,
    ]);
  
    // Combine headers and rows
    const csvContent = [
      headers.join(','), // CSV header row
      ...rows.map(row => row.join(',')) // CSV data rows
    ].join('\n');
  
    // Create a Blob object
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Create a download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "petty_cash_entries.csv");
  
    // Trigger the download
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  