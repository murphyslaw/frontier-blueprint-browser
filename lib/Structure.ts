import { Structures } from "../types/types.d.ts";

export class Structure {
  public structureID: number;
  public blueprintTypeIDs: number[];
  public name: string;
  public type: "printer" | "assembler" | "shipyard" | "refinery";

  constructor(data: Structures["structureID"]) {
    this.structureID = data.structureID;
    this.blueprintTypeIDs = data.blueprintTypeIDs;
    this.name = data.name;
    this.type = data.type;
  }

  public hasBlueprint(blueprintTypeID: number): boolean {
    return this.blueprintTypeIDs.includes(blueprintTypeID);
  }
}
