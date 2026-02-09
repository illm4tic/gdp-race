import * as d3 from 'd3';

const container = d3.select('#chart-container');
const yearDisplay = d3.select('#year-display');

const topN = 10;
const yearDuration = 3000; // 每年的动画时长（毫秒）
const barPadding = 0.25;

// 国际化配置
const i18n = {
  zh: {
    title: "1960 - 2023 全球 GDP 历年排名动态竞赛 (Top 10)",
    dataSource: "数据来源: 世界银行 (World Bank) 真实历史 GDP 数据 (1960-2023) | 单位: 10亿美元 (Billions USD)",
    eventDesc: "事件描述",
    eventImpact: "历史影响",
    unit: "10亿美元"
  },
  en: {
    title: "1960 - 2023 Global GDP Ranking Dynamics (Top 10)",
    dataSource: "Data Source: World Bank Real Historical GDP Data (1960-2023) | Unit: Billions USD",
    eventDesc: "Description",
    eventImpact: "Impact",
    unit: "B USD"
  }
};

let currentLang = localStorage.getItem('lang') || 'zh';

function updateStaticUI() {
  const langData = i18n[currentLang];
  d3.select('#page-title').text(langData.title);
  d3.select('#data-source').text(langData.dataSource);
  d3.select('#event-desc-label').text(currentLang === 'zh' ? '事件描述 / Description' : 'Description / 事件描述');
  d3.select('#event-impact-label').text(currentLang === 'zh' ? '历史影响 / Impact' : 'Impact / 历史影响');
  document.title = langData.title;
  d3.select('html').attr('lang', currentLang === 'zh' ? 'zh-CN' : 'en');
  
  // 更新按钮激活状态
  d3.selectAll('.lang-btn').classed('active', false);
  d3.select(`#lang-${currentLang}`).classed('active', true);
}

// 初始化 UI
updateStaticUI();

// 语言切换监听器
  d3.select('#lang-zh').on('click', () => {
    if (currentLang === 'zh') return;
    currentLang = 'zh';
    localStorage.setItem('lang', 'zh');
    updateStaticUI();
    updateChartLabels();
  });

  d3.select('#lang-en').on('click', () => {
    if (currentLang === 'en') return;
    currentLang = 'en';
    localStorage.setItem('lang', 'en');
    updateStaticUI();
    updateChartLabels();
  });

  function updateChartLabels() {
    // 即使动画停止，也更新现有条形图的文本标签
    g.selectAll('.bar').each(function(d) {
      const bar = d3.select(this);
      bar.select('.name-label').text(currentLang === 'zh' ? d.name_cn : d.name);
      bar.select('.name-en-label').text(currentLang === 'zh' ? d.name : d.name_cn);
      bar.select('.value-label').text(`$${d3.format(",.2f")(d.value)} ${i18n[currentLang].unit}`);
    });
    
    // 如果动画已停止，则更新坐标轴
    if (xScale.domain()[1] > 0) {
      const xAxis = d3.axisBottom(xScale)
        .ticks(width > 800 ? 10 : 5)
        .tickFormat(d => `$${d3.format(".2s")(d).replace('G', 'B')}`);
      xAxisG.call(xAxis);
    }
  }

// 尺寸将动态计算
let width, height, margin, innerWidth, innerHeight;

const svg = container.append('svg');
const g = svg.append('g');

// 比例尺
const xScale = d3.scaleLinear();
const yScale = d3.scaleBand()
  .paddingInner(barPadding)
  .paddingOuter(barPadding);

// 坐标轴
const xAxisG = g.append('g').attr('class', 'x-axis');

// 添加网格线
const gridG = g.append('g').attr('class', 'grid');

function updateDimensions() {
  const rect = container.node().getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  
  const isMobile = width < 768;
  const isSmallHeight = height < 500;
  
  margin = { 
    top: isSmallHeight ? 10 : 20, 
    right: isMobile ? 80 : 150, 
    bottom: isSmallHeight ? 50 : 80, 
    left: isMobile ? 120 : 200 
  };
  
  innerWidth = Math.max(width - margin.left - margin.right, 100);
  innerHeight = Math.max(height - margin.top - margin.bottom, 100);

  svg.attr('width', width).attr('height', height);
  g.attr('transform', `translate(${margin.left},${margin.top})`);
  
  xScale.range([0, innerWidth]);
  yScale.range([0, innerHeight]);
  
  xAxisG.attr('transform', `translate(0,${innerHeight})`)
    .style('font-size', isSmallHeight ? '10px' : '12px')
    .style('color', '#94a3b8');
}

async function init() {
  const data = await d3.json('/gdp_data.json');
  const historyEvents = await d3.json('/history_events.json');
  
  const eventPanel = d3.select('#event-panel');
   const eventImage = d3.select('#event-image');
   const eventYearText = d3.select('#event-year');
   const eventTitleCn = d3.select('#event-title-cn');
   const eventTitleEn = d3.select('#event-title-en');
   const eventDescCn = d3.select('#event-desc-cn');
   const eventDescEn = d3.select('#event-desc-en');
   const eventImpactCn = d3.select('#event-impact-cn');
   const eventImpactEn = d3.select('#event-impact-en');
   
   let currentEventYear = null;
   let isPaused = false;
   let pausedTimeTotal = 0;
   let pauseStartTime = 0;

  // 为快速查找而对数据进行分组
  const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);
  const minYear = years[0];
  const maxYear = years[years.length - 1];
  
  // 创建映射表: iso3 -> { year: value }
  const countryData = new Map();
  d3.group(data, d => d.iso3).forEach((values, iso3) => {
    const yearMap = new Map();
    values.forEach(v => yearMap.set(v.year, v.value));
    countryData.set(iso3, yearMap);
  });

  const countryMeta = new Map();
  data.forEach(d => {
    if (!countryMeta.has(d.iso3)) {
      countryMeta.set(d.iso3, {
        name: d.name,
        name_cn: d.name_cn,
        color: d.color,
        flag: d.flag,
        iso3: d.iso3
      });
    }
  });

  // 获取插值数据的辅助函数
  function getInterpolatedData(decimalYear) {
    const year = Math.floor(decimalYear);
    const fraction = decimalYear - year;
    const nextYear = Math.min(year + 1, maxYear);
    
    const results = [];
    countryMeta.forEach((meta, iso3) => {
      const yearMap = countryData.get(iso3);
      const val1 = yearMap.get(year) || 0;
      const val2 = yearMap.get(nextYear) || val1;
      const interpolatedValue = val1 + (val2 - val1) * fraction;
      
      if (interpolatedValue > 0) {
        results.push({
          ...meta,
          value: interpolatedValue
        });
      }
    });
    
    // 过滤潜在的重复项并确保数值有效
    const uniqueResults = Array.from(new Map(results.map(d => [d.iso3, d])).values());
    
    return uniqueResults.sort((a, b) => b.value - a.value).slice(0, topN);
  }

  updateDimensions();
  window.addEventListener('resize', updateDimensions);

  const positions = new Map(); // 存储用于 lerp 的当前 Y 轴位置
  const lerpFactor = 0.1; // 排名变化的平滑系数 (0.1 = 约 10 帧达到目标位置)

  const ticker = d3.timer(elapsed => {
    if (isPaused) return;

    const adjustedElapsed = elapsed - pausedTimeTotal;
    const totalDuration = (years.length - 1) * yearDuration;
    const t = Math.min(adjustedElapsed / totalDuration, 1);
    const decimalYear = minYear + t * (maxYear - minYear);
    const currentYear = Math.floor(decimalYear);
    
    // 检查历史事件以触发暂停
    const event = historyEvents.find(e => e.year === currentYear);
    if (event && currentEventYear !== currentYear) {
      currentEventYear = currentYear;
      isPaused = true;
      pauseStartTime = d3.now();

      // 填充弹窗内容
      eventYearText.text(event.year);
      eventTitleCn.text(event.event_cn);
      eventTitleEn.text(event.event);
      eventDescCn.text(event.description_cn);
      eventDescEn.text(event.description);
      eventImpactCn.text(event.impact_cn);
      eventImpactEn.text(event.impact);
      eventImage.attr('src', event.image_url);
      
      // 显示弹窗
      eventPanel.classed('visible', true);

      // 3 秒后继续
      setTimeout(() => {
        eventPanel.classed('visible', false);
        isPaused = false;
        pausedTimeTotal += (d3.now() - pauseStartTime); // 使用 d3.now() 保持一致性
      }, 3000);

      return; // 停止当前帧的更新
    }

    const yearData = getInterpolatedData(decimalYear);
    
    // 更新比例尺
    xScale.domain([0, d3.max(yearData, d => d.value) * 1.1]);
    yScale.domain(yearData.map(d => d.iso3));

    // 更新坐标轴和网格（每隔几帧更新一次，或使用过渡效果以避免抖动）
    const xAxis = d3.axisBottom(xScale)
      .ticks(width > 800 ? 10 : 5)
      .tickFormat(d => `$${d3.format(".2s")(d).replace('G', i18n[currentLang].unit === 'B USD' ? 'B' : 'B')}`);
    xAxisG.call(xAxis);

    const grid = d3.axisBottom(xScale)
      .ticks(width > 800 ? 10 : 5)
      .tickSize(-innerHeight)
      .tickFormat("");
    gridG.call(grid)
      .selectAll(".tick line")
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-dasharray", "2,2");
    gridG.select(".domain").remove();

    yearDisplay.text(currentYear);

    // 使用 lerp 更新位置，实现平滑的排名交换
    const currentIso3s = new Set(yearData.map(d => d.iso3));
    yearData.forEach((d, i) => {
      const targetY = yScale(d.iso3);
      if (!positions.has(d.iso3)) {
        positions.set(d.iso3, innerHeight + 100);
      }
      const currentY = positions.get(d.iso3);
      const nextY = currentY + (targetY - currentY) * lerpFactor;
      positions.set(d.iso3, nextY);
    });

    // 清理已离开图表的国家的位置信息，防止内存增长
    if (elapsed % 5000 < 20) { // 每 5 秒左右执行一次
      positions.forEach((_, iso3) => {
        if (!currentIso3s.has(iso3)) positions.delete(iso3);
      });
    }

    // 数据绑定
    const bars = g.selectAll('.bar')
      .data(yearData, d => d.iso3);

    // 进入阶段
    const barsEnter = bars.enter().append('g')
      .attr('class', 'bar')
      .style('opacity', 0)
      .attr('transform', d => `translate(0, ${innerHeight + 100})`);

    barsEnter.append('rect')
      .attr('class', 'bar-rect')
      .attr('rx', 4);

    const isMobile = width < 768;
    const flagSize = Math.min(yScale.bandwidth() * 0.9, isMobile ? 18 : 24);
    const flagXOffset = isMobile ? -100 : -140;
    const nameXOffset = isMobile ? -75 : -100;

    barsEnter.append('image')
      .attr('class', 'country-flag')
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))');

    barsEnter.append('text')
      .attr('class', 'crown-icon')
      .attr('text-anchor', 'middle')
      .text('👑');

    barsEnter.append('text')
      .attr('class', 'name-label')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#f1f5f9')
      .style('font-weight', '600');

    barsEnter.append('text')
      .attr('class', 'name-en-label')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#94a3b8');

    barsEnter.append('text')
      .attr('class', 'value-label')
      .attr('dy', '0.35em')
      .attr('fill', '#f8fafc')
      .style('font-weight', '700')
      .style('font-family', 'monospace');

    // 更新阶段（不使用过渡，以保证逐帧动画的流畅性）
    const barsUpdate = bars.merge(barsEnter);
    
    barsUpdate
      .interrupt() // 如果重新进入，停止任何待处理的退出过渡
      .classed('exiting', false)
      .attr('transform', d => `translate(0, ${positions.get(d.iso3)})`)
      .style('opacity', 1);

    barsUpdate.select('.bar-rect')
      .attr('width', d => xScale(d.value))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => d.color);

    barsUpdate.select('.country-flag')
      .attr('href', d => d.flag)
      .attr('x', flagXOffset)
      .attr('y', (yScale.bandwidth() - flagSize) / 2)
      .attr('width', flagSize * 1.5)
      .attr('height', flagSize);

    barsUpdate.select('.name-label')
      .text(d => currentLang === 'zh' ? d.name_cn : d.name)
      .attr('x', nameXOffset)
      .attr('y', yScale.bandwidth() / 2 - 6)
      .style('font-size', isMobile ? '11px' : '13px');

    barsUpdate.select('.name-en-label')
      .text(d => currentLang === 'zh' ? d.name : d.name_cn)
      .attr('x', nameXOffset)
      .attr('y', yScale.bandwidth() / 2 + 8)
      .style('font-size', isMobile ? '9px' : '10px');

    barsUpdate.select('.crown-icon')
      .attr('x', flagXOffset + (flagSize * 1.5) / 2)
      .attr('y', (yScale.bandwidth() - flagSize) / 2 - 2)
      .style('font-size', isMobile ? '12px' : '18px')
      .style('opacity', (d, i) => i === 0 ? 1 : 0);

    barsUpdate.select('.value-label')
      .attr('x', d => xScale(d.value) + 15)
      .attr('y', yScale.bandwidth() / 2)
      .style('font-size', isMobile ? '12px' : '14px')
      .text(d => `$${d3.format(",.2f")(d.value)} ${i18n[currentLang].unit}`);

    // 退出阶段
    bars.exit()
      .filter(function() { return !d3.select(this).classed('exiting'); })
      .classed('exiting', true)
      .transition()
      .duration(500)
      .style('opacity', 0)
      .attr('transform', `translate(0, ${innerHeight + 100})`)
      .remove();

    if (t >= 1) {
      // 最后执行一次追赶式 lerp，确保所有条形图在结束时完美对齐
      let allSettled = true;
      yearData.forEach(d => {
        const targetY = yScale(d.iso3);
        const currentY = positions.get(d.iso3);
        if (Math.abs(targetY - currentY) > 0.1) {
          allSettled = false;
          const nextY = currentY + (targetY - currentY) * lerpFactor;
          positions.set(d.iso3, nextY);
        } else {
          positions.set(d.iso3, targetY);
        }
      });
      if (allSettled) ticker.stop();
    }
  });
}

init();
