import React from 'react'
import { ResponsiveTreeMap } from '@nivo/treemap'

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
  return (
    <div style={{ height: '300px' }}>
      <ResponsiveTreeMap
        data={data}
        identity="name"
        value="value"
        valueFormat=".02s"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        labelSkipSize={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
        parentLabelPosition="left"
        parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        borderColor={{ from: 'color', modifiers: [['darker', 0.1]] }}
        colors={{ scheme: 'nivo' }}
      />
    </div>
  )
}

export default TreemapChart


