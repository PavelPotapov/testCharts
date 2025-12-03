import React from 'react'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Ant Design Charts Examples</h1>
      <div style={{ marginBottom: '40px' }}>
        <h2>Bar Chart</h2>
        <BarChart />
      </div>
      <div>
        <h2>Line Chart</h2>
        <LineChart />
      </div>
    </div>
  )
}

export default App

