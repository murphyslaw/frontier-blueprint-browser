export function durationFormat(duration: number): string {
  // const sec_num = parseInt(duration, 10); // don't forget the second param
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = duration - hours * 3600 - minutes * 60;

  return hours + "h " + minutes + "m " + seconds + "s";
}

export function volumeFormat(volume: number): string {
  return volume.toFixed(2);
}
