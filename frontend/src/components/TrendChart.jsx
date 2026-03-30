import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fmtINR } from "../utils/formatters.js";
import TooltipComponent from "./TooltipComponent.jsx";

export default function TrendChart({ data }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
        Weekly Spend Trend (Last 6 Weeks)
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="week"
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
          <defs>
            <linearGradient id="lG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="total"
            name="Spend"
            stroke="url(#lG)"
            strokeWidth={2.5}
            dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
