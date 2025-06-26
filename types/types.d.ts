import { Blueprint } from "./schema.blueprints.d.ts";

export { Blueprint } from "./schema.blueprints.d.ts";
export type Type = {
  basePrice: number;
  capacity: number;
  description?: string;
  descriptionID?: number;
  graphicID?: number;
  groupID: number;
  iconID?: number;
  marketGroupID?: number;
  mass: number;
  metaGroupID?: number;
  platforms: number;
  portionSize: number;
  published: number;
  radius: number;
  typeID: number;
  typeName: string;
  typeNameID: number;
  volume: number;
};

export type Types = { [key: string]: Type };

export type Group = {
  groupName: string;
};

export interface Structure {
  structureID: number;
  blueprintTypeIDs: number[];
  name: string;
  type: "printer" | "assembler" | "shipyard" | "refinery";
}

export interface Structures {
  [structureID: string]: Structure;
}

export interface Blueprints {
  [blueprintTypeID: string]: Blueprint;
}
