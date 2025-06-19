export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  let timeoutId: number | undefined = undefined;

  return (...args: Args) => {
    globalThis.clearTimeout(timeoutId);

    timeoutId = globalThis.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
