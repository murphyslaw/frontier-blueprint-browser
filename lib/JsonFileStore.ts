export class JsonFileStore {
  public static async write(filePath: string, json: unknown): Promise<void> {
    try {
      return await Deno.writeTextFile(filePath, JSON.stringify(json));
    } catch (error) {
      throw new Error("could not write json to file", { cause: error });
    }
  }

  public static async read<T>(filePath: string): Promise<T> {
    return JSON.parse(await Deno.readTextFile(filePath)) as T;
  }
}
