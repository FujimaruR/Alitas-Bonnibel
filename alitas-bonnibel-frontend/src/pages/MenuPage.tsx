import { PublicLayout } from "../components/layout/PublicLayout";

export default function MenuPage() {
  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="font-display text-4xl text-slate-900">Menú</h1>
        <p className="text-slate-600 mt-2">Aquí irá tu menú (luego lo conectamos al backend).</p>
      </div>
    </PublicLayout>
  );
}
