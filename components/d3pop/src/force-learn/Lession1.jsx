import React, { useEffect } from 'react'
import * as d3 from 'd3'

export default ({
  width = 600,
  height = 300
}) => {
  const ref = React.createRef()

  const nodes = [
    { x: width, y: height },
    { x: width / 3, y: height / 2 },
    { x: 0, y: 0 }
  ]

  const links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 2 }
  ]

  useEffect(() => {
    const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)

    const simulation = d3.forceSimulation(nodes)

    // simulation.alpha(0.8)
    const forceLink = d3.forceLink(links).distance(210)
    const forceCenter = d3.forceCenter(width / 3, height / 2)
    const forceX = d3.forceX(200)

    simulation
      // .force('link', forceLink)
      // .force('center', forceCenter)
      .force('forceX', forceX)

    const link = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')

    // Now it's the nodes turn. Each node is drawn as a circle.

    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')

    simulation.on('tick', function () {
      node.attr('r', width / 25)
        .attr('cx', function (d) { return d.x })
        .attr('cy', function (d) { return d.y })

      link.attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y })
    })

    // Okay, everything is set up now so it's time to turn
    // things over to the force layout. Here we go.

    simulation.restart()

    ref.current.append(svg.node())
  })
  return <div ref={ref} />
}
