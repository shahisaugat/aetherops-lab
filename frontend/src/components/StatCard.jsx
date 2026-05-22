export default function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
      {detail ? <p className="mt-1 text-sm text-slate-500">{detail}</p> : null}
    </div>
  );
}
