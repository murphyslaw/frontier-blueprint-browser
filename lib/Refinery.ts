export type ResourceTypeID = string;

export interface ResourceDefinition {
  produces: ResourceProduction;
  cost: number;
}

import { Blueprint, BlueprintTypeID, ResourceProduction } from "./Blueprint.ts";
import { BlueprintDB } from "./BlueprintDB.ts";

export class Refinery {
  private blueprints: Blueprint[];
  public resources: Record<ResourceTypeID, ResourceDefinition>;

  constructor(blueprintTypeIDs: BlueprintTypeID[], blueprintDB: BlueprintDB) {
    this.blueprints = blueprintTypeIDs.reduce<Blueprint[]>(
      (acc, blueprintTypeID) => {
        const blueprint = blueprintDB.get(blueprintTypeID);

        if (blueprint) {
          acc.push(blueprint);
        }

        return acc;
      },
      [],
    );

    // create map of blueprint ids and their outputs
    this.resources = {};
    for (const blueprint of this.blueprints) {
      const blueprintTypeID = blueprint.blueprintTypeID;

      let cost = blueprint.inputs[0].quantity;

      // manually adjust some of the input costs, to reflect rarity
      // - Mummified Clones (88778, Portable Refinery)
      // - Mummified Clones (88779, Refinery L)
      if ([88778, 88779].includes(Number(blueprintTypeID))) {
        cost = Number.MAX_SAFE_INTEGER;
      }

      this.resources[blueprintTypeID] = {
        produces: {},
        cost,
      };

      for (const output of blueprint.outputs) {
        this.resources[blueprintTypeID].produces[output.typeID] =
          output.quantity;
      }
    }
  }

  public hasBlueprint(blueprintTypeID: Blueprint["blueprintTypeID"]): boolean {
    const result = this.blueprints.some((blueprint) =>
      blueprint.blueprintTypeID === blueprintTypeID
    );

    return result;
  }
}
