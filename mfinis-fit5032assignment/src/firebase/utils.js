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
