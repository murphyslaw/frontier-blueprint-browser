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
        <a
          href={`https://www.efbom.com/?item=${type.typeID}&blueprint=${blueprint.blueprintTypeID}`}
          title="Open EVE Frontier Bill of Materials"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M12 2v2" />
            <path d="M12 22v-2" />
            <path d="m17 20.66-1-1.73" />
            <path d="M11 10.27 7 3.34" />
            <path d="m20.66 17-1.73-1" />
            <path d="m3.34 7 1.73 1" />
            <path d="M14 12h8" />
            <path d="M2 12h2" />
            <path d="m20.66 7-1.73 1" />
            <path d="m3.34 17 1.73-1" />
            <path d="m17 3.34-1 1.73" />
            <path d="m11 13.73-4 6.93" />
          </svg>
        </a>
      </summary>

      <comp.Blueprint blueprint={blueprint} />
    </details>
  );
}
