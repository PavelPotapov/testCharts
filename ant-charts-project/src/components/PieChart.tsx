import React from 'react'
import { Pie } from '@ant-design/charts'

const data = [
  { name: 'Янв', value: 400 },
  { name: 'Фев', value: 300 },
  { name: 'Мар', value: 200 },
  { name: 'Апр', value: 278 },
  { name: 'Май', value: 189 },
]

const PieChart: React.FC = () => {
  const config = {
    data,
    angleField: 'value',
    colorField: 'name',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
    height: 300,
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Pie {...config} />
    </div>
  )
}

export default PieChart

