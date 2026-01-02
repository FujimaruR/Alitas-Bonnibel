const API_URL = import.meta.env.VITE_API_URL;

function toProductId(id: unknown): number {
  // acepta 13, "13", "p-13"
  const raw = String(id ?? "");
  const normalized = raw.startsWith("p-") ? raw.slice(2) : raw;
  const n = Number(normalized);

  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`productId inválido: ${raw}`);
  }
  return n;
}

export async function createOrder(items: any[]) {
  const payload = {
    type: "TAKEOUT",
    items: items.map((i) => ({
      productId: toProductId(i.id),
      quantity: Number(i.qty),
    })),
  };

  const res = await fetch(`${API_URL}/public/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Mejor error para debug
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`No se pudo crear la orden (${res.status}): ${text}`);
  }

  return res.json();
}
