import React from 'react'
import { Column } from '@ant-design/charts'

const data = [
  { name: 'Янв', value: 400 },
  { name: 'Фев', value: 300 },
  { name: 'Мар', value: 200 },
  { name: 'Апр', value: 278 },
  { name: 'Май', value: 189 },
]

const BarChart: React.FC = () => {
  const config = {
    data,
    xField: 'name',
    yField: 'value',
    height: 300,
    columnWidthRatio: 0.8,
    xAxis: {
      visible: true,
    },
    yAxis: {
      visible: true,
    },
    meta: {
      name: { alias: 'Месяц' },
      value: { alias: 'Значение' },
    },
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Column {...config} />
    </div>
  )
}

export default BarChart

