import { Blueprint as TBlueprint } from "../types/types.d.ts";
import { Blueprint } from "./Blueprint.ts";
import { JsonFileStore } from "./JsonFileStore.ts";

type Blueprints = Record<string, TBlueprint>;

export class BlueprintDB {
  public static async fromJSONFile(file: string) {
    const json = await JsonFileStore.read<Blueprints>(file);

    return BlueprintDB.fromJSON(json);
  }

  public static fromJSON(json: Blueprints) {
    const collection = Object.values(json).reduce<
      Map<number, Blueprint>
    >(
      (acc, data) => {
        const typeID = data.blueprintTypeID;
        const item = new Blueprint(data);

        acc.set(Number(typeID), item);

        return acc;
      },
      new Map(),
    );

    return new BlueprintDB(collection);
  }

  constructor(private collection: Map<number, Blueprint>) {}

  public get(typeID: number): Blueprint | undefined {
    return this.collection.get(typeID);
  }

  public find(
    filter?: { blueprintTypeIDs?: Blueprint["blueprintTypeID"][] },
  ): Blueprint[] {
    if (filter?.blueprintTypeIDs) {
      const result = Array.from(
        this.collection.values().filter((item) =>
          filter.blueprintTypeIDs!.includes(item.blueprintTypeID)
        ),
      );

      return result;
    }

    return Array.from(this.collection.values());
  }

  public findByInput(typeID: number): Blueprint[] {
    const result: Blueprint[] = [];

    this.collection.forEach((item) => {
      if (item.inputs.some((resource) => resource.typeID === typeID)) {
        result.push(item);
      }
    });

    return result;
  }

  public findByOutput(typeID: number): Blueprint[] {
    const result: Blueprint[] = [];

    this.collection.forEach((item) => {
      if (item.outputs.some((resource) => resource.typeID === Number(typeID))) {
        result.push(item);
      }
    });

    return result;
  }
}
