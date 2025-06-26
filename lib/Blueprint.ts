import { Blueprint as TBlueprint } from "../types/types.d.ts";

export type BlueprintTypeID = number;
type Blueprints = Record<string, TBlueprint>;
export type ResourceDescription = { quantity: number; typeID: number };
export type Material = string;
type ManufacturingType = "inputs" | "outputs";
export type Requirements = { [typeID: string]: number };

export interface ResourceProduction {
  [material: Material]: number;
}

export class Blueprint {
  public inputs: ResourceDescription[];
  public outputs: ResourceDescription[];
  public time: number;
  public blueprintTypeID: BlueprintTypeID;

  constructor(
    public blueprintData: Blueprints["blueprintID"],
  ) {
    const manufacturing = blueprintData?.activities?.manufacturing;

    if (!manufacturing) {
      throw new Error("Invalid blueprint data");
    }

    this.inputs = manufacturing.materials || [];
    this.outputs = manufacturing.products || [];
    this.time = manufacturing.time || 0;
    this.blueprintTypeID = blueprintData.blueprintTypeID;
  }

  public getByManufacturingType(
    manufacturingType: ManufacturingType,
  ): ResourceDescription[] {
    return this[manufacturingType] || [];
  }

  public requirements(): Requirements {
    const requirements: Requirements = {};

    for (const input of this.inputs) {
      const id = input.typeID;

      if (!requirements[id]) {
        requirements[id] = 0;
      }

      requirements[id] += input.quantity;
    }

    return requirements;
  }
}
