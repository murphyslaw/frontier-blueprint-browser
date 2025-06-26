import { ResourceDescription } from "./Blueprint.ts";
import { Type } from "./Type.ts";
import { TypeDB } from "./TypeDB.ts";

type TypeSummary = { type: Type; quantity: number };

export class Summary {
  public volume: number = 0;
  public mass: number = 0;
  public types: TypeSummary[] = [];

  constructor(typeDB: TypeDB, typeReferences: ResourceDescription[]) {
    this.types = typeReferences.reduce<TypeSummary[]>(
      (acc, { typeID, quantity }) => {
        const type = typeDB.get(typeID);

        if (!type) return acc;

        this.volume += (quantity ?? 1) * (type.volume ?? 0);
        this.mass += (quantity ?? 1) * (type.mass ?? 0);

        acc.push({ type, quantity });

        return acc;
      },
      [],
    );
  }
}
