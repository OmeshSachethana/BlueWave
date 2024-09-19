// Utility function to convert a list of objects to CSV format
export const convertToCSV = (data, headers) => {
    const rows = data.map((item) => headers.map((header) => item[header]));
  
    let csvContent = `data:text/csv;charset=utf-8,${[headers, ...rows].map((e) => e.join(',')).join('\n')}`;
    return encodeURI(csvContent);
  };
  
  // Utility function to trigger the download of a CSV file
  export const downloadCSV = (csvContent, fileName) => {
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  