import { readdir, stat } from 'fs/promises'
import { join } from 'path'

// Функция для получения размера файла в KB
async function getFileSize(filePath) {
  try {
    const stats = await stat(filePath)
    return (stats.size / 1024).toFixed(2)
  } catch {
    return '0'
  }
}

// Функция для получения размера директории
async function getDirSize(dirPath) {
  try {
    const files = await readdir(dirPath)
    let totalSize = 0
    
    for (const file of files) {
      const filePath = join(dirPath, file)
      const stats = await stat(filePath)
      
      if (stats.isDirectory()) {
        totalSize += await getDirSize(filePath)
      } else {
        totalSize += stats.size
      }
    }
    
    return (totalSize / 1024).toFixed(2)
  } catch {
    return '0'
  }
}

async function compareBundles() {
  const projects = ['recharts-project', 'nivo-project', 'ant-charts-project']
  const results = []

  console.log('📊 Сравнение размеров бандлов\n')

  for (const project of projects) {
    const distPath = join(project, 'dist')
    
    try {
      const totalSize = await getDirSize(distPath)
      const assetsPath = join(distPath, 'assets')
      
      let jsSize = 0
      let cssSize = 0
      let htmlSize = 0
      
      // Размер HTML файла
      const htmlPath = join(distPath, 'index.html')
      try {
        htmlSize = parseFloat(await getFileSize(htmlPath))
      } catch {
        // HTML может не существовать
      }
      
      try {
        const assets = await readdir(assetsPath)
        for (const asset of assets) {
          const assetPath = join(assetsPath, asset)
          const fileSize = parseFloat(await getFileSize(assetPath))
          if (asset.endsWith('.js')) {
            jsSize += fileSize
          } else if (asset.endsWith('.css')) {
            cssSize += fileSize
          }
        }
      } catch {
        // assets папка может не существовать
      }
      
      // Общий размер = HTML + JS + CSS
      const totalActual = (htmlSize + jsSize + cssSize).toFixed(2)
      jsSize = jsSize.toFixed(2)
      cssSize = cssSize.toFixed(2)

      results.push({
        project,
        total: totalActual,
        js: jsSize,
        css: cssSize,
      })
    } catch (error) {
      console.warn(`⚠️  ${project}: dist папка не найдена. Запустите npm run build сначала.`)
    }
  }

  if (results.length > 0) {
    console.log('Результаты:\n')
    console.log('┌─────────────────────┬──────────┬──────────┬──────────┐')
    console.log('│ Проект              │ Всего KB │ JS KB    │ CSS KB   │')
    console.log('├─────────────────────┼──────────┼──────────┼──────────┤')
    
    results.forEach(({ project, total, js, css }) => {
      console.log(`│ ${project.padEnd(19)} │ ${total.padStart(8)} │ ${js.padStart(8)} │ ${css.padStart(8)} │`)
    })
    
    console.log('└─────────────────────┴──────────┴──────────┴──────────┘\n')
    
    // Находим минимальный размер (по JS, так как это основной бандл)
    const minJs = Math.min(...results.map(r => parseFloat(r.js)))
    const winner = results.find(r => parseFloat(r.js) === minJs)
    console.log(`🏆 Самый легкий JS бандл: ${winner.project} (${winner.js} KB)`)
  }
}

compareBundles().catch(console.error)


