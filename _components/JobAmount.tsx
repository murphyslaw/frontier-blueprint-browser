import { Blueprint } from "../types/types.d.ts";

export const css = `
.job-amount {
  display: flex;
  gap: 0.5rem;
  border: none;
  margin: 0;
  padding: 0;

  button {
    color: var(--text);
    background-color: var(--accent-bg);
    border: 1px solid var(--border);

    &:hover {
      color: var(--accent);
    }
  }
}
`;

interface Data {
  blueprint: Blueprint;
  volume: number;
}

export default function (data: Data & Lume.Data) {
  const { blueprint, volume } = data;

  return (
    <fieldset class="job-amount">
      <input
        type="number"
        id={`runs-${blueprint.blueprintTypeID}`}
        value="1"
        min={1}
        max={blueprint.maxProductionLimit}
      />

      <button type="button" value={volume}>
        Max
      </button>
    </fieldset>
  );
}
