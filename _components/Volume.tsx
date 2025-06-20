import { volumeFormat } from "../lib/format.ts";

interface Data {
  volume: number;
}

export default function (data: Data) {
  const { volume } = data;

  return (
    <span style="text-wrap: nowrap;">
      <span data-volume={volume}>{volumeFormat(volume)}</span>{" "}
      <abbr title="cubic meters">
        m<sup>3</sup>
      </abbr>
    </span>
  );
}
