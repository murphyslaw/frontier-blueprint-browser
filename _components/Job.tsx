import { Blueprint } from "../lib/Blueprint.ts";
import { Structure } from "../lib/Structure.ts";
import { Type } from "../types/types.d.ts";

function getType(
  blueprint: Blueprint,
  types: Type[],
  isRefinery: boolean
): Type {
  const list = isRefinery ? blueprint.inputs : blueprint.outputs;

  return types[list[0].typeID];
}

interface Data {
  blueprint: Blueprint;
  types: Type[];
  structure: Structure;
}

export default function (data: Data & Lume.Data) {
  const { blueprint, types, structure, comp } = data;

  const type = getType(blueprint, types, structure.type === "refinery");

  return (
    <details data-name={type.typeName} data-typeID={type.typeID}>
      <summary>
        <img src={`/assets/images/type-${type.iconID}.png`} />

        {type.typeName}

        <comp.BOMLink
          typeID={type.typeID}
          blueprintTypeID={blueprint.blueprintTypeID}
        />
      </summary>

      <comp.Blueprint blueprint={blueprint} />
    </details>
  );
}
