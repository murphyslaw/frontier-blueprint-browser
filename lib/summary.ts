import { Blueprint, Type, Types } from "../types/types.d.ts";

export class Summary {
  public volume: number = 0;
  public mass: number = 0;
  public types: { type: Type; quantity: number }[] = [];

  constructor(typesMap: Types, typeReferences: Blueprint['activities']['manufacturing']['materials']) {
    this.types = typeReferences.map(({ typeID, quantity }) => {
      const type: Type = typesMap[typeID];

      this.volume += (quantity ?? 1) * (type.volume ?? 0);
      this.mass += (quantity ?? 1) * (type.mass ?? 0);

      return { type, quantity };
    });
  }
}
