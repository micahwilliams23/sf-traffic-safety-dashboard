export function range(start: number, end: number, step: number = 1) {
  // If only one argument is provided, treat it as 'end' and set 'start' to 0
  if (end === undefined) {
    end = start;
    start = 0;
  }
  // Determine step direction if not provided
  if (step === undefined) {
    step = start < end ? 1 : -1;
  }

  // Calculate the length of the resulting array
  const length = Math.ceil((end - start) / step);

  // Use Array.from() with a mapping function to fill the array
  return Array.from({ length }, (_, i) => start + i * step);
}
