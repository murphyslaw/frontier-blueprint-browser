import { anchorize } from "../lib/anchorize.ts";
import { Blueprint } from "../lib/Blueprint.ts";
import { StructureDB } from "../lib/StructureDB.ts";
import { Summary } from "../lib/Summary.ts";
import { TypeDB } from "../lib/TypeDB.ts";
import type { Structures, Types } from "../types/types.d.ts";

interface Data {
  blueprint: Blueprint;
  types: Types;
  structures: Structures;
}

export default function (data: Data & Lume.Data) {
  const { blueprint, types, comp, structures } = data;

  const structureDB = StructureDB.fromJSON(structures);
  const typeDB = TypeDB.fromJSON(types);

  const inputSummary = new Summary(typeDB, blueprint.inputs);
  const outputSummary = new Summary(typeDB, blueprint.outputs);

  return (
    <section data-blueprintTypeID={String(blueprint.blueprintTypeID)}>
      <table>
        <thead>
          <tr>
            <th>Job Amount</th>

            <th>Time</th>

            <th>Structures</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <comp.JobAmount
                blueprint={blueprint}
                volume={inputSummary.volume}
              />
            </td>

            <td>
              <comp.Duration duration={blueprint.time} />
            </td>

            <td>
              {structureDB
                .withBlueprint(blueprint.blueprintTypeID)
                .map((structure, index) => [
                  index > 0 && ", ",
                  <a
                    class="group-link"
                    key={structure.name}
                    href={`/#${anchorize(structure.name)}`}
                  >
                    {structure.name}
                  </a>,
                ])}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>&#10095;&#10095; Input</h3>

      <comp.SummaryTable summary={inputSummary} />

      <h3>Output &#10095;&#10095;</h3>

      <comp.SummaryTable summary={outputSummary} />
    </section>
  );
}
