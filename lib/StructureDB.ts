import { Structures } from "../types/types.d.ts";
import { JsonFileStore } from "./JsonFileStore.ts";
import { Structure } from "./Structure.ts";

export class StructureDB {
  public static async fromJSONFile(file: string) {
    const json = await JsonFileStore.read<Structures>(file);

    return StructureDB.fromJSON(json);
  }

  public static fromJSON(json: Structures) {
    const collection = Object.values(json).reduce<
      Map<number, Structure>
    >(
      (acc, data) => {
        const id = data.structureID;
        const item = new Structure(data);

        acc.set(id, item);

        return acc;
      },
      new Map(),
    );

    return new StructureDB(collection);
  }

  constructor(private collection: Map<number, Structure>) {}

  public get(id: number): Structure | undefined {
    return this.collection.get(id);
  }

  public withBlueprint(blueprintTypeID: number): Structure[] {
    return Array.from(
      this.collection.values().filter((item) =>
        item.hasBlueprint(blueprintTypeID)
      ),
    );
  }

  public find(
    filter?: {
      types?: Structure["type"][];
      structureIDs?: Structure["structureID"][];
    },
  ): Structure[] {
    if (filter?.types) {
      const result = Array.from(
        this.collection.values().filter((item) =>
          filter.types!.includes(item.type)
        ),
      );

      return result;
    }

    if (filter?.structureIDs) {
      const result = Array.from(
        this.collection.values().filter((item) =>
          filter.structureIDs!.includes(item.structureID)
        ),
      );

      return result;
    }

    return Array.from(this.collection.values());
  }

  public getByType(type: Structure["type"]) {
    const result = Array.from(
      this.collection.values().filter((r) => r.type === type),
    );

    return result;
  }
}
