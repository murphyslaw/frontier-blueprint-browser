import { sort } from "./lib/sort.ts";
import { Typelist } from "./types/schema.typelist.d.ts";
import { Blueprint, Type } from "./types/types.d.ts";

export const layout = "layout.tsx";

interface Data {
  blueprintsbyid: Blueprint[];
  blueprintsbymaterialtypeids: { [key: string]: number[] };
  types: Type[];
  typelistSelection: {
    [key: string]: { name: string; namingBase: "inputs" | "outputs" };
  };
  typelist: Typelist;
}

export default function (data: Data & Lume.Data) {
  const { typelistSelection, typelist, comp } = data;

  const structures: (Typelist["key"] & {
    blueprints: Blueprint[];
    namingBase: "inputs" | "outputs";
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

  return structures.map((structure) => (
    <div data-group={structure.name}>
      <h2>{structure.name}</h2>

      {structure.blueprints.map((blueprint) => (
        <comp.Job blueprint={blueprint} structure={structure} />
      ))}
    </div>
  ));
}
