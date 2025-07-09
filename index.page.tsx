import { anchorize } from "./lib/anchorize.ts";
import { BlueprintDB } from "./lib/BlueprintDB.ts";
import { sort } from "./lib/sort.ts";
import { StructureDB } from "./lib/StructureDB.ts";
import { Blueprints, Structures } from "./types/types.d.ts";

export const layout = "layouts/layout.tsx";

interface Data {
  blueprints: Blueprints;
  structures: Structures;
}

export default function (data: Data & Lume.Data) {
  const { comp } = data;

  const blueprintDB = BlueprintDB.fromJSON(data.blueprints);
  const structureDB = StructureDB.fromJSON(data.structures);

  const structures = structureDB.find().map((structure) => {
    const blueprints = blueprintDB.find({
      blueprintTypeIDs: structure.blueprintTypeIDs,
    });

    return {
      blueprints,
      name: structure.name,
    };
  });

  sort(structures, "name");

  return (
    <>
      <nav class="group-links">
        {structures.map((structure) => (
          <a
            href={`#${anchorize(structure.name)}`}
            class="group-link"
            data-group={structure.name}
          >
            {structure.name}
          </a>
        ))}
      </nav>

      {structures.map((structure) => (
        <div data-group={structure.name}>
          <h2 id={anchorize(structure.name)}>{structure.name}</h2>

          {structure.blueprints.map((blueprint) => (
            <comp.Job blueprint={blueprint} structure={structure} />
          ))}
        </div>
      ))}
    </>
  );
}
