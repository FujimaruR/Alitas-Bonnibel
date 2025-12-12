import { PublicLayout } from "../components/layout/PublicLayout";

export default function NosotrosPage() {
  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="font-display text-4xl text-slate-900">Nosotros</h1>
        <p className="text-slate-600 mt-2">Historia, misión, valores, etc.</p>
      </div>
    </PublicLayout>
  );
}
