import React from 'react'
import { ResponsiveHeatMap } from '@nivo/heatmap'

const data = [
  { id: 'Пн', data: [{ x: 'Значение', y: 400 }] },
  { id: 'Вт', data: [{ x: 'Значение', y: 300 }] },
  { id: 'Ср', data: [{ x: 'Значение', y: 200 }] },
  { id: 'Чт', data: [{ x: 'Значение', y: 278 }] },
  { id: 'Пт', data: [{ x: 'Значение', y: 189 }] },
]

const HeatmapChart: React.FC = () => {
  return (
    <div style={{ height: '300px' }}>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        valueFormat=" >-.2f"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: '',
          legendOffset: 46,
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Значение',
          legendPosition: 'middle',
          legendOffset: 70,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'День',
          legendPosition: 'middle',
          legendOffset: -72,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: 46,
        }}
        colors={{
          type: 'sequential',
          scheme: 'blues',
          minValue: 0,
          maxValue: 400,
        }}
        emptyColor="#555555"
        legends={[
          {
            anchor: 'bottom',
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: 'row',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            tickFormat: '>-.2f',
            title: 'Значение →',
            titleAlign: 'start',
            titleOffset: 4,
          },
        ]}
      />
    </div>
  )
}

export default HeatmapChart


