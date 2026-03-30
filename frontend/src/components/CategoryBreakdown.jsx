import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fmtFull } from "../utils/formatters.js";

export default function CategoryBreakdown({ data }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
          Category Split (This Week)
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              cx="50%"
              cy="50%"
              outerRadius={72}
              innerRadius={36}
              paddingAngle={3}
            >
              {chartData.map((c, i) => (
                <Cell key={i} fill={c.color} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => fmtFull(v)}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
          Top Spend Areas
        </div>
        <div className="space-y-3">
          {chartData.slice(0, 6).map((c, i) => {
            const grandTotal = chartData.reduce((s, x) => s + x.amount, 0) || 1;
            const pct = Math.round((c.amount / grandTotal) * 100);
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-300">
                    {c.icon} {c.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600">{pct}%</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: c.color }}
                    >
                      {fmtFull(c.amount)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: c.color,
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
