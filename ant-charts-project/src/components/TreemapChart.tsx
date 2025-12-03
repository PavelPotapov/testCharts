import React from 'react'
import { Treemap } from '@ant-design/charts'

const data = {
  name: 'root',
  children: [
    { name: 'Категория A', value: 400 },
    { name: 'Категория B', value: 300 },
    { name: 'Категория C', value: 200 },
    { name: 'Категория D', value: 278 },
    { name: 'Категория E', value: 189 },
  ],
}

const TreemapChart: React.FC = () => {
  const config = {
    data,
    colorField: 'value',
    valueField: 'value',
    height: 300,
    scale: {
      color: {
        range: [
          '#4e79a7',
          '#f28e2c',
          '#e15759',
          '#76b7b2',
          '#59a14f',
        ],
      },
    },
    legend: false,
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Treemap {...config} />
    </div>
  )
}

export default TreemapChart

