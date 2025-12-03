import React from 'react'
import { Radar } from '@ant-design/charts'

const data = [
  { item: 'A', value: 120 },
  { item: 'B', value: 98 },
  { item: 'C', value: 86 },
  { item: 'D', value: 99 },
  { item: 'E', value: 85 },
]

const RadarChart: React.FC = () => {
  const config = {
    data,
    xField: 'item',
    yField: 'value',
    height: 300,
    area: {},
    point: {
      size: 2,
    },
    meta: {
      item: { alias: 'Категория' },
      value: { alias: 'Значение' },
    },
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Radar {...config} />
    </div>
  )
}

export default RadarChart


