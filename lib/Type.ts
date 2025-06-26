import { Types } from "../types/types.d.ts";

export class Type {
  public typeID: number;
  public typeName: string;
  public volume: number;
  public mass: number;
  public iconID: number;

  constructor(data: Types["key"]) {
    this.typeID = data.typeID;
    this.typeName = data.typeName;
    this.volume = data.volume;
    this.mass = data.mass;
    this.iconID = data.iconID ?? 0;
  }
}
