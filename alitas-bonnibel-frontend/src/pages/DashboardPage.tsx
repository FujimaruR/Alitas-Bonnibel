import { AppLayout } from "../components/layout/AppLayout";

export default function DashboardPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-300 text-sm">
        Aquí luego pondremos ventas del día, órdenes activas, etc.
      </p>
    </AppLayout>
  );
}
