export function Stat({label, value}){
  return (
    <div className="card p-4">
      <div className="text-xs text-white/80">{label}</div>
      <div className="text-lg font-semibold text-brand-alt">{value}</div>
    </div>
  );
}
