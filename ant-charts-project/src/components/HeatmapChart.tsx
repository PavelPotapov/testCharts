import React from 'react'
import { Heatmap } from '@ant-design/charts'

const data = [
  { name: 'Пн', value: 400, country: 'A' },
  { name: 'Вт', value: 300, country: 'A' },
  { name: 'Ср', value: 200, country: 'A' },
  { name: 'Чт', value: 278, country: 'A' },
  { name: 'Пт', value: 189, country: 'A' },
  { name: 'Пн', value: 350, country: 'B' },
  { name: 'Вт', value: 250, country: 'B' },
  { name: 'Ср', value: 180, country: 'B' },
  { name: 'Чт', value: 220, country: 'B' },
  { name: 'Пт', value: 150, country: 'B' },
]

const HeatmapChart: React.FC = () => {
  const config = {
    data,
    xField: 'name',
    yField: 'country',
    colorField: 'value',
    sizeField: 'value',
    shapeField: 'square',
    height: 300,
    label: {
      text: (d: any) => d.value,
      position: 'inside' as const,
      style: {
        fill: '#fff',
        pointerEvents: 'none',
      },
    },
    scale: {
      size: { range: [12, 20] },
      color: { range: ['#dddddd', '#9ec8e0', '#5fa4cd', '#2e7ab6', '#114d90'] },
    },
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Heatmap {...config} />
    </div>
  )
}

export default HeatmapChart

