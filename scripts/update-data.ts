import { join } from "jsr:@std/path";
import { JsonFileStore } from "../lib/JsonFileStore.ts";
import { Blueprint, Structures, Type } from "../types/types.d.ts";

interface Typelist {
  [key: string]: {
    includedTypeIDs: number[];
  };
}

const structuresExtensions: Record<
  string,
  { name: string; type: "printer" | "assembler" | "shipyard" | "refinery" }
> = {
  "814": {
    name: "Portable Printer",
    type: "printer",
  },
  "815": {
    name: "Printer S",
    type: "printer",
  },
  "816": {
    name: "Printer L",
    type: "printer",
  },
  "836": {
    name: "Portable Refinery",
    type: "refinery",
  },
  "837": {
    name: "Refinery",
    type: "refinery",
  },
  "838": {
    name: "Refinery L",
    type: "refinery",
  },
  "840": {
    name: "Assembler",
    type: "assembler",
  },
  "841": {
    name: "Shipyard S",
    type: "shipyard",
  },
  "842": {
    name: "Shipyard M",
    type: "shipyard",
  },
  "843": {
    name: "Shipyard L",
    type: "shipyard",
  },
  "844": {
    name: "Printer M",
    type: "printer",
  },
};

async function run(command: Deno.Command): Promise<void> {
  const { code, stdout, stderr } = await command.output();

  if (code != 0) {
    const decoder = new TextDecoder();

    console.log("stdout", decoder.decode(stdout));
    console.error("stderr", decoder.decode(stderr));

    Deno.exit(code);
  }
}

async function renameFiles(
  root: string,
  pairs: { from: string; to: string }[],
): Promise<void> {
  for (const { from, to } of pairs) {
    await Deno.rename(join(root, from), join(root, to));
  }
}

const cwd = Deno.cwd();
const dataDir = join(cwd, "_data");
const source = Deno.env.get("EVE_CLIENT_DATA_ARCHIVE");
const resourceDir = Deno.env.get("EVE_CLIENT_ICONS");
const assetsDir = join(cwd, "assets", "images");

if (!source) {
  console.error("EVE_CLIENT_DATA_ARCHIVE environment variable is not set.");
  Deno.exit(1);
}

if (!resourceDir) {
  console.error("EVE_CLIENT_ICONS environment variable is not set.");
  Deno.exit(1);
}

// ensure asset directory exists
await Deno.mkdir(assetsDir, { recursive: true });

// extract data
await run(
  new Deno.Command("tar", {
    args: [
      "-x",
      "-f",
      source,
      "-C",
      dataDir,
    ],
    stdout: "piped",
    stderr: "piped",
  }),
);

// cleanup source
// await Deno.remove(source, { recursive: true });

// move and name data files
await renameFiles(dataDir, [
  { from: "fsd_binary/typelist.json", to: "typelist.json" },
  { from: "fsd_binary/types.json", to: "types.json" },
  { from: "fsd_binary/iconids.json", to: "iconids.json" },
  { from: "fsd_lite/blueprints.json", to: "blueprints.json" },
]);

// cleanup data
await Deno.remove(join(dataDir, "fsd_binary"), { recursive: true });
await Deno.remove(join(dataDir, "fsd_lite"), { recursive: true });

// get all structures
const structures = await JsonFileStore.read<Typelist>(
  join(dataDir, "typelist.json"),
);

// filter structures by structure ids
const selectedStructures = Object.entries(structuresExtensions).reduce<
  Structures
>(
  (acc, [structureID, structure]) => {
    acc[structureID] = {
      structureID: Number(structureID),
      blueprintTypeIDs: structures[structureID].includedTypeIDs,
      name: structure.name,
      type: structure.type,
    };

    return acc;
  },
  {},
);

JsonFileStore.write(join(dataDir, "structures.json"), selectedStructures);
await Deno.remove(join(dataDir, "typelist.json"), { recursive: true });

// lookup blueprint in _data/blueprints.json
const blueprints = await JsonFileStore.read<{ [key: string]: Blueprint }>(
  join(dataDir, "blueprints.json"),
);
// filter blueprints by blueprints of selected structures
const selectedBlueprints = Object.fromEntries(
  Object.entries(blueprints).filter(
    ([id]) =>
      Object.entries(selectedStructures).some(
        ([_structureId, structure]) =>
          structure.blueprintTypeIDs.includes(Number(id)),
      ),
  ),
);

JsonFileStore.write(join(dataDir, "blueprints.json"), selectedBlueprints);

// lookup types in _data/types.json
const types = await JsonFileStore.read<{ [key: string]: Type }>(
  join(dataDir, "types.json"),
);

// get all selected types from selected blueprints
const selectedTypeIds = new Set<number>();
Object.values(selectedBlueprints).forEach((blueprint) => {
  blueprint.activities.manufacturing.materials.forEach((input) =>
    selectedTypeIds.add(input.typeID)
  );
  blueprint.activities.manufacturing.products.forEach((output) =>
    selectedTypeIds.add(output.typeID)
  );
});

// filter types by selected type ids
const selectedTypes = Object.fromEntries(
  Object.entries(types).filter(
    ([id]) => selectedTypeIds.has(Number(id)),
  ),
);

JsonFileStore.write(join(dataDir, "types.json"), selectedTypes);

// get all icon ids from selected types
const selectedIconIds = new Set<number>();
Object.values(selectedTypes).forEach((type) => {
  if (type.iconID) {
    selectedIconIds.add(type.iconID);
  }
});

// lookup icon file in iconids.json
const iconIds = await JsonFileStore.read<
  { [key: string]: { iconFile: string } }
>(
  join(dataDir, "iconids.json"),
);
// filter icon files by selected icon ids
const selectedIcons = Object.fromEntries(
  Object.entries(iconIds).filter(([id]) => selectedIconIds.has(Number(id))),
);

JsonFileStore.write(join(dataDir, "iconids.json"), selectedIcons);

// copy selected icon files from icon-extractor to assets/images
for (const [id, icon] of Object.entries(selectedIcons)) {
  const iconFile = join(resourceDir, icon.iconFile.split(":")[1]);
  const destFile = join(assetsDir, `type-${id}.png`);

  await Deno.copyFile(iconFile, destFile);
}
