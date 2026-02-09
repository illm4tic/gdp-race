# 1960-2023 Global GDP Racing Bar Chart (Top 10)

[English](#english) | [中文](#chinese)

<a name="english"></a>

## English Version

This is an interactive Global GDP historical data visualization project developed based on D3.js. It displays the ranking evolution of the world's top 10 economies from 1960 to 2023 in the form of a Racing Bar Chart.

### 🌟 Key Features

- **Dynamic Ranking Race**: Real-time calculation and display of global GDP ranking changes with smooth transition animations.
- **Historical Event Pop-ups**: Automatically pauses the animation at key years (e.g., China joining the WTO, Oil Crisis) to display full-screen historical background, bilingual descriptions, impacts, and authentic historical images.
- **Smooth Interpolation (Lerp)**: Utilizes linear interpolation technology to ensure bar movements are fluid and natural during ranking swaps.
- **Bilingual Support**: The interface and event descriptions support both English and Chinese.
- **Responsive Design**: Adapts to different screen sizes, ensuring a great visual experience on both mobile and desktop.
- **Authentic Data Source**: Data is sourced from the World Bank, covering real historical GDP values from 1960 to 2023.

### 🛠️ Tech Stack

- **Visualization Engine**: [D3.js v7](https://d3js.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 (including glassmorphism, grid layout, CSS animations)

### 📂 Project Structure

```text
├── public/
│   ├── images/          # Local high-definition images for historical events
│   ├── gdp_data.json    # Processed global GDP historical data
│   └── history_events.json # Data for major historical events and their impacts
├── src/
│   ├── main.js          # D3 rendering logic, animation engine, and event control
│   └── style.css        # Base styles
├── index.html           # Project entry and UI structure
├── generate_data.js     # Data preprocessing and cleaning script
└── package.json         # Project dependencies and scripts
```

### 🚀 Quick Start

#### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and `pnpm` (or npm/yarn) installed.

#### 1. Install Dependencies
```bash
pnpm install
```

#### 2. Start Development Server
```bash
pnpm dev
```
Open the local address shown in your browser.

#### 3. Build for Production
```bash
pnpm build
```
The build artifacts will be generated in the `dist` directory.

---

<a name="chinese"></a>

## 中文版

这是一个基于 D3.js 开发的交互式全球 GDP 历史数据可视化项目。它以动态竞赛图（Racing Bar Chart）的形式展示了从 1960 年到 2023 年全球前十大经济体的排名演变。

### 🌟 功能特点

- **动态排名竞赛**：实时计算并展示各国 GDP 排名变化，伴随丝滑的位移动画。
- **历史大事件弹窗**：在关键年份（如中国加入 WTO、石油危机等）会自动暂停动画，并以全屏形式展示相关的历史背景、中英文描述、影响及真实历史图片。
- **平滑插值 (Lerp)**：采用线性插值技术，确保排名交换时的动画流畅自然，无跳变。
- **双语支持**：界面及事件描述均支持中英文双语展示。
- **响应式设计**：适配不同尺寸的屏幕，确保在移动端和 PC 端都有良好的视觉体验。
- **真实数据源**：数据来源于世界银行 (World Bank)，涵盖 1960-2023 年的真实历史 GDP 数值。

### 🛠️ 技术栈

- **可视化引擎**：[D3.js v7](https://d3js.org/)
- **构建工具**：[Vite](https://vitejs.dev/)
- **语言**：JavaScript (ES6+)
- **样式**：CSS3 (包含毛玻璃效果、网格布局、CSS 动画)

### 📂 项目结构

```text
├── public/
│   ├── images/          # 历史事件相关的本地高清图片
│   ├── gdp_data.json    # 经过处理的全球 GDP 历史数据
│   └── history_events.json # 历史重大事件及其影响的数据
├── src/
│   ├── main.js          # D3 渲染逻辑、动画引擎及事件控制逻辑
│   └── style.css        # 基础样式
├── index.html           # 项目入口及 UI 结构
├── generate_data.js     # 数据预处理及清洗脚本
└── package.json         # 项目依赖及运行脚本
```

### 🚀 快速开始

#### 环境依赖
确保您的电脑已安装 [Node.js](https://nodejs.org/) 和 `pnpm` (或 npm/yarn)。

#### 1. 安装依赖
```bash
pnpm install
```

#### 2. 启动开发服务器
```bash
pnpm dev
```
启动后访问浏览器显示的本地地址即可预览。

#### 3. 项目打包
```bash
pnpm build
```
打包产物将生成在 `dist` 目录下。
