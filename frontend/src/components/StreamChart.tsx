"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { STREAM_META, type Stream } from "@/lib/types";

/**
 * Single-series horizontal bar chart: items logged per stream. One hue (emerald), recessive
 * axes, direct value labels, hover tooltip. Stream identity is carried by the axis labels.
 */
export function StreamChart({ data }: { data: Array<{ stream: Stream; count: number }> }) {
  const rows = data.map((d) => ({ ...d, label: STREAM_META[d.stream].label }));
  const height = Math.max(120, rows.length * 38 + 16);

  return (
    <div style={{ height }} className="-ml-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }} barCategoryGap={8}>
          <XAxis type="number" hide domain={[0, "dataMax"]} />
          <YAxis
            type="category"
            dataKey="label"
            width={132}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#57534e", fontSize: 12, fontWeight: 500 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(5, 150, 105, 0.06)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as { label: string; count: number };
              return (
                <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs shadow-md">
                  <p className="font-semibold text-stone-800">{row.label}</p>
                  <p className="text-stone-500">
                    {row.count} {row.count === 1 ? "item" : "items"} logged
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} barSize={18} isAnimationActive={false}>
            <LabelList dataKey="count" position="right" offset={8} style={{ fill: "#1c1917", fontSize: 12, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
