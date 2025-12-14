const API_URL = import.meta.env.VITE_API_URL;

export async function createOrder(items: any[]) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "TAKEOUT",
      items: items.map((i) => ({
        productId: i.id,
        quantity: i.qty,
      })),
    }),
  });

  if (!res.ok) {
    throw new Error("No se pudo crear la orden");
  }

  return res.json();
}
