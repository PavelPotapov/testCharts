# Исследование библиотек графиков

Проект для сравнения размеров бандлов трех библиотек графиков:
- **Recharts**
- **Nivo**
- **Ant Design Charts**

## Структура проекта

```
├── recharts-project/     # Проект с Recharts (workspace)
├── nivo-project/         # Проект с Nivo (workspace)
├── ant-charts-project/   # Проект с Ant Design Charts (workspace)
├── package.json          # Корневой package.json с workspaces и общими зависимостями
└── compare-bundles.js    # Скрипт для сравнения размеров
```

**Структура зависимостей:**
- Общие зависимости (React, Vite, TypeScript) - в корневом `package.json`
- Специфичные библиотеки графиков - в `package.json` каждого workspace
- Общие зависимости объявлены как `peerDependencies` в подпроектах

## Установка и запуск

Проект использует npm workspaces (монорепозиторий). Все общие зависимости (React, Vite, TypeScript) установлены в корне, специфичные библиотеки графиков - в каждом подпроекте.

### 1. Установка зависимостей

**Одна команда для всех проектов:**

```bash
npm install
```

Или используйте явную команду:

```bash
npm run install:all
```

Эта команда установит все зависимости (общие в корне, специфичные в каждом workspace) для всех трех проектов одновременно.

### 2. Сборка всех проектов

**Вариант 1: Сборка всех проектов одной командой (рекомендуется)**

```bash
npm run build:all
```

**Вариант 2: Сборка по отдельности**

```bash
npm run build:recharts
npm run build:nivo
npm run build:ant
```

Или вручную:
```bash
cd recharts-project && npm run build && cd ..
cd nivo-project && npm run build && cd ..
cd ant-charts-project && npm run build && cd ..
```

### 3. Сравнение размеров бандлов

После сборки всех проектов запустите скрипт сравнения:

```bash
npm run compare
```

Или напрямую:
```bash
node compare-bundles.js
```

Скрипт покажет таблицу с размерами бандлов для каждого проекта.

## Разработка

Для запуска в режиме разработки:

```bash
# Из корня проекта
npm run dev -w recharts-project
npm run dev -w nivo-project
npm run dev -w ant-charts-project

# Или из папки проекта
cd recharts-project  # или nivo-project, или ant-charts-project
npm run dev
```

## Что включено в каждый проект

- **Bar Chart** - пример столбчатой диаграммы
- **Line Chart** - пример линейного графика
- Минимальная конфигурация Vite для production сборки

