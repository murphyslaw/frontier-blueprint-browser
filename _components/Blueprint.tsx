import { anchorize } from "../lib/anchorize.ts";
import { durationFormat } from "../lib/format.ts";
import { Summary } from "../lib/summary.ts";
import { Typelist } from "../types/schema.typelist.d.ts";
import type { Blueprint, TypelistSelection, Types } from "../types/types.d.ts";

interface Data {
  blueprint: Blueprint;
  types: Types;
  typelist: Typelist;
}

function findStructuresForBlueprint(
  blueprint: Blueprint,
  typelist: Typelist,
  typelistSelection: TypelistSelection
): string[] {
  const structures = new Set<string>();

  for (const [structureId, structure] of Object.entries(typelist)) {
    if (structure.includedTypeIDs.includes(blueprint.blueprintTypeID)) {
      const details = typelistSelection[structureId];

      if (!details) continue;

      structures.add(details.name);
    }
  }

  return Array.from(structures);
}

export default function (data: Data & Lume.Data) {
  const { blueprint, types, comp, typelist, typelistSelection } = data;

  const inputSummary = new Summary(
    types,
    blueprint.activities.manufacturing.materials
  );
  const outputSummary = new Summary(
    types,
    blueprint.activities.manufacturing.products
  );

  return (
    <section data-blueprintTypeID={String(blueprint.blueprintTypeID)}>
      <table>
        <thead>
          <tr>
            <th>Job Amount</th>

            <th>Time</th>

            <th>Facilities</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <input
                type="number"
                id={`runs-${blueprint.blueprintTypeID}`}
                value="1"
                min={1}
                max={blueprint.maxProductionLimit}
              />
            </td>

            <td>
              <span data-duration={blueprint.activities.manufacturing.time}>
                {durationFormat(blueprint.activities.manufacturing.time)}
              </span>
            </td>

            <td>
              {findStructuresForBlueprint(
                blueprint,
                typelist,
                typelistSelection
              ).map((structure, index) => [
                index > 0 && ", ",
                <a
                  class="group-link"
                  key={structure}
                  href={`/#${anchorize(structure)}`}
                >
                  {structure}
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
