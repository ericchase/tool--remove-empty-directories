function U8Concat(arrays: Uint8Array[]): Uint8Array {
  // Calculate the total length of all arrays combined
  let totalLength = 0;
  for (const array of arrays) {
    totalLength += array.length;
  }
  // Create a new Uint8Array with the total length
  const result = new Uint8Array(totalLength);
  // Copy each array into the result array
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}

export async function U8StreamReadAll(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    if (done) {
      break;
    }
  }
  return U8Concat(chunks);
}
