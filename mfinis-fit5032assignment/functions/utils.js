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
