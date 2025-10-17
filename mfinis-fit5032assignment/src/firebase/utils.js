export const hasRequiredFields = (dataObject, fieldsArray) => {
  let missingFields = [];

  for (const field of fieldsArray) {
    if(!Object.keys(dataObject).includes(field) || dataObject[field] === undefined) {
      missingFields.push(field);
    }
  }
  return {
    hasFields: missingFields.length === 0,
    errorMsg: missingFields.length === 0 ?
      '' :
      'Error - missing the following fields: ' + missingFields.join('\n')
  };
}

export const generateCsvFile = (headers, rowData) => {
  const rows = [headers.join(',')];
  for (const row of rowData) {
    rows.push(row.join(','));
  }
  
  return rows.join('\n');
}

export const downloadCsvFile = (fileName, csvFile) => {
  const blob = new Blob(['\uFEFF', csvFile], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();

  downloadLink.remove();
  URL.revokeObjectURL(url);
}
