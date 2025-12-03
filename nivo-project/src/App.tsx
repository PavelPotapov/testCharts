import React from 'react'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import AreaChart from './components/AreaChart'
import ScatterChart from './components/ScatterChart'
import RadarChart from './components/RadarChart'
import HeatmapChart from './components/HeatmapChart'
import TreemapChart from './components/TreemapChart'

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Nivo Examples</h1>
      <div style={{ marginBottom: '40px' }}>
        <h2>Bar Chart</h2>
        <BarChart />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Line Chart</h2>
        <LineChart />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Pie Chart</h2>
        <PieChart />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Area Chart</h2>
        <AreaChart />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Scatter Chart</h2>
        <ScatterChart />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Radar Chart</h2>
        <RadarChart />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Heatmap Chart</h2>
        <HeatmapChart />
      </div>
      <div>
        <h2>Treemap Chart</h2>
        <TreemapChart />
      </div>
    </div>
  )
}

export default App


