import React, { useEffect } from 'react'
import * as d3 from 'd3'

export default ({
  series = [{
    value: 100
  }, {
    value: 120
  }, {
    value: 20
  }, {
    value: 80
  }, {
    value: 90
  }],
  colorFrom = 'brown',
  colorTo = 'steelblue',
  // 按间距等分
  divideEqualBetween = 30,
  // 固定间距
  fixedBetweenSpace = 60,
  // 固定中心距离
  fixedDistance = 60,

  maxWidth = 50,
  width = 1200,
  height = 300
}) => {
  const ref = React.createRef()

  // 计算节点宽度
  const calcWidth = d3.scaleLinear()
    .domain([0, d3.max(d3.map(series, t => t.value))])
    .range([0, maxWidth])
  // 节点颜色计算
  const calcColor = d3.scaleLinear()
    .domain([0, d3.max(d3.map(series, t => t.value))])
    .range([colorFrom, colorTo])
  // 节点横向位置计算
  const calcX = d3.scaleLinear()
    .domain([0, width])
    .range([0, (series.length - 1) * fixedBetweenSpace + d3.sum(series.map(d => d.value))])

  useEffect(() => {
    const root = d3.create('div')
    root.attr('width', width).attr('height', height)

    const nodes = series.map(d => {
      return Object.assign({
        x: 0,
        y: 0
      }, d)
    })
    const simulation = d3.forceSimulation(nodes)
    const forceY = d3.forceY(height / 2)

    simulation.force('y', forceY)

    const bullbleRects = root
      .selectAll('div.bubble')
      .data(nodes)
      .join('div')
      .attr('class', 'bubble')
      .style('left', (d, index) => index * fixedBetweenSpace + fixedBetweenSpace / 2 - calcWidth(d.value) / 2 + 'px')
      .style('top', d => (height / 2 - calcWidth(d.value) / 2) + 'px')
      .style('position', 'absolute')
      .style('border-radius', '100%')
      .style('width', d => calcWidth(d.value) + 'px')
      .style('height', d => calcWidth(d.value) + 'px')
      .style('background', d => calcColor(d.value))

    // Okay, everything is set up now so it's time to turn
    // things over to the force layout. Here we go.

    simulation.restart()

    ref.current.append(root.node())
  })
  return <div ref={ref} />
}
