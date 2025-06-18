import { sort } from "./lib/sort.ts";
import { Blueprint, Group, Type } from "./types/types.d.ts";

export const layout = "layout.tsx";

interface Data {
  blueprints: { [key: string]: Blueprint };
  blueprintsbymaterialtypeids: { [key: string]: number[] };
  types: Type[];
  groups: { [key: string]: Group };
}

export default function (data: Data & Lume.Data) {
  const { blueprints, types, groups, comp } = data;

  const typeIdsWithBlueprints = Object.values(blueprints).reduce<Set<number>>(
    (acc, blueprint) => {
      const products = blueprint.activities?.manufacturing?.products;

      if (!products) return acc;

      products.forEach((product) => acc.add(product.typeID));

      return acc;
    },
    new Set<number>()
  );

  const typesWithBlueprints = Array.from(typeIdsWithBlueprints).reduce<
    Data["types"]
  >((acc, id) => {
    const type = types[Number(id)];

    if (!type) return acc;

    acc.push(type);

    return acc;
  }, []);

  sort(typesWithBlueprints, "typeName_en-us");

  const grouped = Object.groupBy(
    typesWithBlueprints,
    ({ groupID }) => groups[String(groupID)]["groupName_en-us"] ?? "unknown"
  );

  return (
    <>
      {Object.keys(grouped).map((group) => (
        <div data-group={group}>
          <h2>{group}</h2>

          {grouped[group]?.map((type) => (
            <comp.Type type={type} />
          ))}
        </div>
      ))}
    </>
  );
}
