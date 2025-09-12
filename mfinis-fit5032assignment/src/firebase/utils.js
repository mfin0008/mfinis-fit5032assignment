export const hasRequiredFields = (dataObject, fieldsArray) => {
  let missingFields = [];

  for (const field of fieldsArray) {
    if(!Object.keys(dataObject).includes(field)) {
      missingFields.push(field);
    }
  }

  return {
    hasFields: missingFields.length === 0,
    errorMsg: missingFields.length === 0 ?
      '' :
      () => {
        let msg = 'Error - missing the following fields:\n';
        for (const field of missingFields) {
          msg += field + '\n';
        }
        return msg;
      }
  }
}

export const OrderDirection = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
})
