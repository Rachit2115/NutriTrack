"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

interface NutrientChartProps {
  protein: number
  carbs: number
  fat: number
}

export function NutrientChart({ protein, carbs, fat }: NutrientChartProps) {
  const data = [
    { name: "Protein", value: protein, calories: protein * 4 },
    { name: "Carbs", value: carbs, calories: carbs * 4 },
    { name: "Fat", value: fat, calories: fat * 9 },
  ]

  const COLORS = ["#8b5cf6", "#10b981", "#f59e0b"]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold" fontSize="12">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const totalNutrients = protein + carbs + fat

  if (totalNutrients === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-muted-foreground">
        No nutrition data to display. Log your food to see your macronutrient breakdown.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1500}
          animationBegin={300}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => {
            return [`${value}g (${data.find((item) => item.name === name)?.calories || 0} kcal)`, name]
          }}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: "8px",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend formatter={(value, entry) => <span style={{ color: entry.color, fontWeight: "bold" }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

