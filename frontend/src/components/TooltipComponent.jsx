import { fmtFull } from "../utils/formatters.js";

export default function TooltipComponent({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {fmtFull(p.value)}
        </p>
      ))}
    </div>
  );
}
