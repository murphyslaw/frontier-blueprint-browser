import { Blueprint } from "../types/types.d.ts";

export function findBlueprints(blueprintsById: { [key: number]: Blueprint }, typeID: number): Blueprint[] {
  const blueprints: Blueprint[] = [];

  for (const blueprint of Object.values(blueprintsById)) {
    const products = blueprint.activities?.manufacturing?.products;

    if (!products) continue;

    if (products.some((product) => product.typeID === typeID)) {
      blueprints.push(blueprint);
    }
  }

  return blueprints;
}
