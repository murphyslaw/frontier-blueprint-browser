export const css = `
.input-cargo {
  display: flex;

  input {
    text-align: center;
  }

  abbr {
    margin-left: -3px;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.5rem 0 0.5rem;
    background-color: var(--accent-bg);
    border: 1px solid var(--border);
    border-radius: 0 var(--standard-border-radius) var(--standard-border-radius) 0;
  }
}
`;

export default function () {
  return (
    <div class="input-cargo">
      <input
        type="number"
        id="cargo"
        placeholder="Cargo"
        value="520"
        min="520"
        max="10000"
        step="100"
        aria-label="Search and filter types"
      />

      <abbr title="cubic meters">
        m<sup>3</sup>
      </abbr>
    </div>
  );
}
