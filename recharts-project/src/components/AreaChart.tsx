import React from 'react'
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Янв', value: 400 },
  { name: 'Фев', value: 300 },
  { name: 'Мар', value: 200 },
  { name: 'Апр', value: 278 },
  { name: 'Май', value: 189 },
]

const AreaChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

export default AreaChart


