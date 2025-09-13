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

const BATCH_LIMIT = 10;

export function splitArrayIntoBatchChunks(array) {
  const result = [];

  const numElements = array.length;
  let i = 0;
  let currentBatch = []
  while (i < numElements) {
    if (i > 0 && i%BATCH_LIMIT===0) {
      result.push(currentBatch);
      currentBatch = [];
    }

    currentBatch.push(array[i]);
    i++;
  }
  if (currentBatch.length) result.push(currentBatch);
  return result;
}