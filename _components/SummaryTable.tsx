import { Summary } from "../lib/summary.ts";

interface Data {
  summary: Summary;
}

export default function (data: Data & Lume.Data) {
  const { comp, summary } = data;

  return (
    <table>
      <tbody>
        {summary.types.map(({ type, quantity }) => (
          <comp.Row
            key={type.typeID}
            quantity={quantity}
            name={type["typeName_en-us"]}
            volume={type.volume}
            mass={type.mass}
            iconId={type.iconID}
          />
        ))}
      </tbody>

      <tfoot>
        <comp.Row volume={summary.volume} mass={summary.mass} />
      </tfoot>
    </table>
  );
}
