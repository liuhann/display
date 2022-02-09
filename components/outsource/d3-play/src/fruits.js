const width = 300
const height = 200
const margin = {
  left: 20,
  right: 20
}

export const fruits = [
  { name: '🍊', count: 21 },
  { name: '🍇', count: 13 },
  { name: '🍏', count: 8 },
  { name: '🍌', count: 5 },
  { name: '🍐', count: 3 },
  { name: '🍋', count: 2 },
  { name: '🍎', count: 1 },
  { name: '🍉', count: 1 }
]

// eslint-ignore no-undef
const x = d3.scaleLinear()

x.domain([0, d3.max(fruits, d => d.count)])
x.range([margin.left, width - margin.right])
x.interpolate(d3.interpolateRound)


const html = `<svg viewBox="0 0 ${width} ${height}" style="max-width: ${width}px; font: 10px sans-serif;">
  <g fill="steelblue">
    ${fruits.map(d => svg`<rect y="${y(d.name)}" x="${x(0)}" width="${x(d.count) - x(0)}" height="${y.bandwidth()}"></rect>`)}
  </g>
  <g fill="white" text-anchor="end" transform="translate(-6,${y.bandwidth() / 2})">
    ${fruits.map(d => svg`<text y="${y(d.name)}" x="${x(d.count)}" dy="0.35em">${d.count}</text>`)}
  </g>
  ${d3.select(svg`<g transform="translate(0,${margin.top})">`)
    .call(d3.axisTop(x))
    .call(g => g.select(".domain").remove())
    .node()}
  ${d3.select(svg`<g transform="translate(${margin.left},0)">`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .node()}
</svg>`

documen