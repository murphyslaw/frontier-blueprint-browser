import { Blueprint, Type } from "../types/types.d.ts";

function getType(
  blueprint: Blueprint,
  types: Type[],
  namingBase: "inputs" | "outputs"
): Type {
  const list =
    namingBase === "inputs"
      ? blueprint.activities.manufacturing.materials
      : blueprint.activities.manufacturing.products;

  return types[list[0].typeID];
}

interface Data {
  blueprint: Blueprint;
  types: Type[];
  structure: {
    namingBase: "inputs" | "outputs";
  };
}

export default function (data: Data & Lume.Data) {
  const { blueprint, types, structure, comp } = data;

  const type = getType(blueprint, types, structure.namingBase);

  return (
    <details data-name={type.typeName}>
      <summary>
        <img src={`/assets/images/type-${type.iconID}.png`} />
        {type.typeName}
      </summary>

      <comp.Blueprint blueprint={blueprint} />
    </details>
  );
}
