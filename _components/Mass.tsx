import { massFormat } from "../lib/format.ts";

interface Data {
  mass: number;
}

export default function (data: Data) {
  const { mass } = data;

  return (
    <span style="text-wrap: nowrap;">
      <span data-mass={mass}>{massFormat(mass)}</span>{" "}
      <abbr title="kilograms">kg</abbr>
    </span>
  );
}
