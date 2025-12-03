import React from 'react'
import { Treemap, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Категория A', value: 400 },
  { name: 'Категория B', value: 300 },
  { name: 'Категория C', value: 200 },
  { name: 'Категория D', value: 278 },
  { name: 'Категория E', value: 189 },
]

const TreemapChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <Treemap
        data={data}
        dataKey="value"
        ratio={4 / 3}
        stroke="#fff"
        fill="#8884d8"
      />
    </ResponsiveContainer>
  )
}

export default TreemapChart

