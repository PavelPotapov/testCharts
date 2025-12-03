import React from 'react'
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { subject: 'A', value: 120 },
  { subject: 'B', value: 98 },
  { subject: 'C', value: 86 },
  { subject: 'D', value: 99 },
  { subject: 'E', value: 85 },
]

const RadarChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={90} domain={[0, 150]} />
        <Radar name="Значение" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}

export default RadarChart

