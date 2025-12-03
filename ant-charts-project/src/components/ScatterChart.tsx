import React from 'react'
import { Scatter } from '@ant-design/charts'

const data = [
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
  { x: 110, y: 280 },
]

const ScatterChart: React.FC = () => {
  const config = {
    data,
    xField: 'x',
    yField: 'y',
    height: 300,
    pointSize: 5,
    meta: {
      x: { alias: 'X' },
      y: { alias: 'Y' },
    },
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Scatter {...config} />
    </div>
  )
}

export default ScatterChart


