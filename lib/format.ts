export function durationFormat(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = duration - hours * 3600 - minutes * 60;

  return String(hours).padStart(2, "0") + "h " +
    String(minutes).padStart(2, "0") + "m " + String(seconds).padStart(2, "0") +
    "s";
}

export function volumeFormat(volume: number): string {
  return volume.toFixed(2);
}
