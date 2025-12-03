import React from 'react'

// Простая реализация heatmap через визуализацию
const data = [
  { name: 'Пн', value: 400 },
  { name: 'Вт', value: 300 },
  { name: 'Ср', value: 200 },
  { name: 'Чт', value: 278 },
  { name: 'Пт', value: 189 },
]

const getColor = (value: number) => {
  if (value > 300) return '#ff4d4f'
  if (value > 200) return '#ff7a45'
  if (value > 150) return '#ffa940'
  return '#ffd666'
}

const HeatmapChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '300px', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '100%' }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                height: `${(item.value / 400) * 200}px`,
                backgroundColor: getColor(item.value),
                borderRadius: '4px',
                minHeight: '20px',
              }}
            />
            <div style={{ marginTop: '10px' }}>{item.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeatmapChart

