import { findBlueprints } from "../lib/blueprints.ts";
import { Blueprint } from "../types/schema.blueprints.d.ts";
import { Type } from "../types/types.d.ts";

interface Data {
  type: Type;
  blueprints: Blueprint[];
}

export default function (data: Data & Lume.Data) {
  const { type, comp } = data;

  const blueprints = findBlueprints(data.blueprints, type.typeID ?? 0);

  return (
    <>
      <details data-name={type.typeName}>
        <summary>
          <img src={`/assets/images/type-${type.iconID}.png`} />
          {type.typeName}
        </summary>

        {blueprints.map((blueprint) => (
          <comp.Blueprint blueprint={blueprint} />
        ))}
      </details>
    </>
  );
}
