import React from 'react'
import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
  { x: 110, y: 280 },
]

const ScatterChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" name="X" />
        <YAxis type="number" dataKey="y" name="Y" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Точки" data={data} fill="#8884d8" />
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}

export default ScatterChart


