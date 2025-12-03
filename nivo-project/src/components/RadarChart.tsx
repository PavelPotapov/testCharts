import React from 'react'
import { ResponsiveRadar } from '@nivo/radar'

const data = [
  { taste: 'A', value: 120 },
  { taste: 'B', value: 98 },
  { taste: 'C', value: 86 },
  { taste: 'D', value: 99 },
  { taste: 'E', value: 85 },
]

const RadarChart: React.FC = () => {
  return (
    <div style={{ height: '300px' }}>
      <ResponsiveRadar
        data={data}
        keys={['value']}
        indexBy="taste"
        valueFormat=" >-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.6}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: '#999',
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  )
}

export default RadarChart

