interface Data {
  mass: number;
}

export default function (data: Data) {
  const { mass } = data;

  return (
    <>
      <span data-mass={mass}>{mass}</span> kg
    </>
  );
}
