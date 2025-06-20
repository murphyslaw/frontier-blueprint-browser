interface Data {
  mass: number;
}

export default function (data: Data) {
  const { mass } = data;

  return (
    <span style="text-wrap: nowrap;">
      <span data-mass={mass}>{mass}</span> <abbr title="kilograms">kg</abbr>
    </span>
  );
}
