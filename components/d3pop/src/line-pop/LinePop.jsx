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
  distance = 60,
  maxWidth = 50,
  width = 1200,
  height = 300
}) => {
  const ref = React.createRef()

  const calcWidth = d3.scaleLinear()
    .domain([0, d3.max(d3.map(series, t => t.value))])
    .range([0, maxWidth])
  const calcColor = d3.scaleLinear()
    .domain([0, d3.max(d3.map(series, t => t.value))])
    .range(['brown', 'steelblue'])

  useEffect(() => {
    const root = d3.create('div')
    root.attr('width', width).attr('height', height)
    root
      .selectAll('div.bubble')
      .data(series)
      .join('div')
      .attr('class', 'bubble')
      .style('left', (d, index) => index * distance + distance / 2 - calcWidth(d.value) / 2 + 'px')
      .style('top', d => (height / 2 - calcWidth(d.value) / 2) + 'px')
      .style('position', 'absolute')
      .style('border-radius', '100%')
      .style('width', d => calcWidth(d.value) + 'px')
      .style('height', d => calcWidth(d.value) + 'px')
      .style('background', d => calcColor(d.value))
    ref.current.append(root.node())
  })
  return <div ref={ref} />
}
