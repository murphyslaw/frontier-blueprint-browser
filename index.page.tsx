import { anchorize } from "./lib/anchorize.ts";
import { sort } from "./lib/sort.ts";
import { Typelist } from "./types/schema.typelist.d.ts";
import { Blueprint, Type, TypelistSelection } from "./types/types.d.ts";

export const layout = "layout.tsx";

interface Data {
  blueprintsbyid: Blueprint[];
  blueprintsbymaterialtypeids: { [key: string]: number[] };
  types: Type[];
  typelistSelection: TypelistSelection;
  typelist: Typelist;
}

export default function (data: Data & Lume.Data) {
  const { typelistSelection, typelist, comp } = data;

  const structures: (Typelist["key"] & {
    blueprints: Blueprint[];
    namingBase: "inputs" | "outputs";
    name: string;
  })[] = [];

  for (const [id, { name, namingBase }] of Object.entries(typelistSelection)) {
    const typelistItem = typelist[id];
    const blueprints = typelistItem.includedTypeIDs.map(
      (blueprintId) => data.blueprints[blueprintId]
    );

    structures.push({
      ...typelistItem,
      blueprints,
      name,
      namingBase,
    });
  }

  sort(structures, "name");

  return (
    <>
      <nav class="group-links">
        {structures.map((structure) => (
          <a
            href={`#${anchorize(structure.name)}`}
            class="group-link"
            data-group={structure.name}
          >
            {structure.name}
          </a>
        ))}
      </nav>

      {structures.map((structure) => (
        <div data-group={structure.name}>
          <h2 id={anchorize(structure.name)}>{structure.name}</h2>

          {structure.blueprints.map((blueprint) => (
            <comp.Job blueprint={blueprint} structure={structure} />
          ))}
        </div>
      ))}
    </>
  );
}
