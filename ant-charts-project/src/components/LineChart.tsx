import React from 'react'
import { Line } from '@ant-design/charts'

const data = [
  { name: 'Янв', value: 400 },
  { name: 'Фев', value: 300 },
  { name: 'Мар', value: 200 },
  { name: 'Апр', value: 278 },
  { name: 'Май', value: 189 },
]

const LineChart: React.FC = () => {
  const config = {
    data,
    xField: 'name',
    yField: 'value',
    point: {
      size: 5,
      shape: 'circle',
    },
    meta: {
      name: { alias: 'Месяц' },
      value: { alias: 'Значение' },
    },
  }

  return <Line {...config} style={{ height: '300px' }} />
}

export default LineChart

