import { durationFormat } from "../lib/format.ts";

interface Data {
  duration: number;
}

export const css = `
[data-duration] {
  text-wrap: nowrap;
}
`;

export default function (data: Data & Lume.Data) {
  const { duration } = data;

  return <span data-duration={duration}>{durationFormat(duration)}</span>;
}
