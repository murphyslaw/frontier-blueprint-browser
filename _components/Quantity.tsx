interface Data {
  quantity: number;
}

export default function (data: Data) {
  const { quantity } = data;

  if (!quantity) return;

  return (
    <>
      <span data-quantity={quantity}>{quantity}</span>x
    </>
  );
}
