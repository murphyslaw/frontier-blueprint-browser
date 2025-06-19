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

export type TypelistSelection = {
  [key: string]: {
    name: string;
    namingBase: "inputs" | "outputs";
  };
};
