import { volumeFormat } from "../lib/format.ts";

interface Data {
  volume: number;
}

export default function (data: Data) {
  const { volume } = data;

  let className = "";

  if (volume > 990) {
    className = "critical";
  } else if (volume > 520) {
    className = "warning";
  }

  return (
    <>
      <span data-volume={volume} className={className}>
        {volumeFormat(volume)}
      </span>{" "}
      m<sup>3</sup>
    </>
  );
}
