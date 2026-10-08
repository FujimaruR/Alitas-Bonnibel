export type OrderItem = {
  id: number;
  quantity: number;
  subtotal?: number;
  product?: { name: string } | null;
};
export type Order = {
  id: number;
  type: string;
  status: string;
  created_at: string;
  total_amount: number;
  table?: { name: string } | null;
  created_by?: { name: string } | null;
  items?: OrderItem[];
};
export type Table = { id: number; name: string; status: string; orders?: Order[] };
