interface Data {
  quantity?: number;
  name?: string;
  volume: number;
  mass: number;
  iconId: number;
}

export default function Row(data: Data & Lume.Data) {
  const { quantity, name, volume, mass, iconId, comp } = data;

  return (
    <tr>
      <td>
        <comp.Quantity quantity={quantity} />
      </td>

      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          {name && (
            <>
              <img src={`/assets/images/type-${iconId}.png`} />
              {name}
            </>
          )}
        </div>
      </td>

      <td>
        <comp.Volume volume={(quantity ?? 1) * volume} />
      </td>

      <td>
        <comp.Mass mass={(quantity ?? 1) * mass} />
      </td>
    </tr>
  );
}
