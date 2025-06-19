import { durationFormat } from "../lib/format.ts";
import { Summary } from "../lib/summary.ts";
import type { Blueprint, Types } from "../types/types.d.ts";

interface Data {
  blueprint: Blueprint;
  types: Types;
}

export default function (data: Data & Lume.Data) {
  const { blueprint, types, comp } = data;

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
            <th>Runs</th>

            <th>Duration</th>
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
