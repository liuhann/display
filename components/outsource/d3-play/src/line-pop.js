const root = d3.create('div')
  .attr('width', 1200)
  .attr('height', 200)

root
  .selectAll('div.pop')
  .data(d3.range(100))
  .join('div')
  .attr('className', 'pop')
  .style('left', d => d * 50)
  .style('top', 200 / 2)
  .style('position', 'absolute').transition()
  .style('width', d => Math.random() * 40)
  .style('height', d => Math.random() * 40)
  .style('background', 'hsl(216deg 100% 13%)')

document.body.append(root.node())
