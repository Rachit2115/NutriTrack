"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

interface CalorieChartProps {
  data: {
    date: string
    calories: number
    goal: number
  }[]
}

export function CalorieChart({ data }: CalorieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString(undefined, { weekday: "short" })
          }}
          tick={{ className: "fill-gray-700 dark:fill-white" }}
        />
        <YAxis tick={{ className: "fill-gray-700 dark:fill-white" }} />
        <Tooltip
          formatter={(value) => [`${value} calories`, ""]}
          labelFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })
          }}
          contentStyle={{
            backgroundColor: "rgba(16, 185, 129, 0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: "8px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            color: "white"
          }}
        />
        <Legend />
        <Bar
          name="Consumed=0"
          dataKey="calories"
          fill="rgba(167, 139, 250, 0.8)"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
        <Bar
          name="Calorie Goal"
          dataKey="goal"
          fill="rgba(20, 184, 166, 0.8)"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

