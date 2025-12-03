import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import AreaChart from './components/AreaChart'
import ScatterChart from './components/ScatterChart'

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Ant Design Charts Examples</h1>
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
      <div>
        <h2>Scatter Chart</h2>
        <ScatterChart />
      </div>
    </div>
  )
}

export default App


