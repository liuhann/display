import React, { useEffect } from 'react'
import * as d3 from 'd3'

export default ({
  margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 40
  },
  xAxises = [{
    domain: [0, 100],
    ticks: 9,
    margin: {
      left: 0,
      right: 0
    }
  }],
  yAxises = [],
  width = 1200,
  height = 300
}) => {
  const ref = React.createRef()

  useEffect(() => {
    for (const xAxis of xAxises) {
      const x = d3.scaleLinear()
        .domain(xAxis.domain || [0, 1])
        .range([margin.left - (xAxis?.margin?.left || 0), width - margin.right - (xAxis?.margin?.right)])

      const axisGenerator = d3.axisBottom(x).ticks(xAxis.ticks, '+f')
      console.log('tickValues', axisGenerator.tickValues())
      const xAxisRender = g => g.attr('transform', `translate(0,${height - margin.bottom})`)
        .call(axisGenerator)
      d3.select(ref.current).selectAll('g.xaxis').data([1]).join('g').attr('class', 'xaxis').call(xAxisRender)
      // .selectAll('g.tick')
      // .attr('opacity', 0)
      // .transition()
      // .delay((d, i) => i * 100)
      // .attr('opacity', 1)
      // .attr('transform', (d, i, nodes) => {
      //   console.log(nodes[i].attr('transform'))
      // })
    }
  })
  return <svg ref={ref} width={width + 'px'} height={height + 'px'} viewBox={[0, 0, width, height]} />
}
