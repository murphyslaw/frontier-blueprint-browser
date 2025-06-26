import { BlueprintDB } from "../lib/BlueprintDB.ts";
import { Type } from "../types/types.d.ts";

interface Data {
  type: Type;
  blueprintDB: BlueprintDB;
}

export default function (data: Data & Lume.Data) {
  const { type, blueprintDB, comp } = data;

  const blueprints = blueprintDB.findByOutput(type.typeID);

  return (
    <>
      <details data-name={type.typeName}>
        <summary>
          <img src={`/assets/images/type-${type.iconID}.png`} />

          {type.typeName}

          <comp.BOMLink typeID={type.typeID} />
        </summary>

        {blueprints.map((blueprint) => (
          <comp.Blueprint blueprint={blueprint} />
        ))}
      </details>
    </>
  );
}
