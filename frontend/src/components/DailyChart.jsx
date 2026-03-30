import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fmtINR } from "../utils/formatters.js";
import TooltipComponent from "./TooltipComponent.jsx";

export default function DailyChart({ data }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
        Daily Spending — Last 14 Days
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={3}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "#475569", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmtINR}
          />
          <Tooltip content={<TooltipComponent />} />
          <Bar
            dataKey="food"
            name="Food"
            fill="#f97316"
            opacity={0.8}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="other"
            name="Other"
            fill="#3b82f6"
            opacity={0.8}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-end mt-1">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <div className="w-2 h-2 rounded-sm bg-orange-500" />
          Food
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <div className="w-2 h-2 rounded-sm bg-blue-500" />
          Other
        </div>
      </div>
    </div>
  );
}
