import React from 'react'
import { ResponsiveLine } from '@nivo/line'

const data = [
  {
    id: 'value',
    data: [
      { x: 'Янв', y: 400 },
      { x: 'Фев', y: 300 },
      { x: 'Мар', y: 200 },
      { x: 'Апр', y: 278 },
      { x: 'Май', y: 189 },
    ],
  },
]

const AreaChart: React.FC = () => {
  return (
    <div style={{ height: '300px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        colors={{ scheme: 'nivo' }}
        areaBaselineValue={0}
        enableArea={true}
        areaOpacity={0.6}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  )
}

export default AreaChart

