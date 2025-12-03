import React from 'react'
import { Area } from '@ant-design/charts'

const data = [
  { name: 'Янв', value: 400 },
  { name: 'Фев', value: 300 },
  { name: 'Мар', value: 200 },
  { name: 'Апр', value: 278 },
  { name: 'Май', value: 189 },
]

const AreaChart: React.FC = () => {
  const config = {
    data,
    xField: 'name',
    yField: 'value',
    height: 300,
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
    meta: {
      name: { alias: 'Месяц' },
      value: { alias: 'Значение' },
    },
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Area {...config} />
    </div>
  )
}

export default AreaChart

