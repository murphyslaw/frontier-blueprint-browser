import { Types } from "../types/types.d.ts";
import { JsonFileStore } from "./JsonFileStore.ts";
import { Type } from "./Type.ts";

export class TypeDB {
  public static async fromJSONFile(file: string) {
    const json = await JsonFileStore.read<Types>(file);

    return TypeDB.fromJSON(json);
  }

  public static fromJSON(json: Types) {
    const collection = Object.values(json).reduce<
      Map<number, Type>
    >(
      (acc, data) => {
        const typeID = data.typeID;
        const item = new Type(data);

        acc.set(typeID, item);

        return acc;
      },
      new Map(),
    );

    return new TypeDB(collection);
  }

  constructor(private collection: Map<number, Type>) {}

  public get(typeID: number): Type | undefined {
    return this.collection.get(typeID);
  }

  public all(): Type[] {
    return Array.from(this.collection.values());
  }
}
