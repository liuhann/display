import * as React from 'react'

export default class Ruler extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      scrollPos: 252
    }
    this.canvasElementRef = React.createRef()
  }

  render () {
    return (
      <canvas
        ref={this.canvasElementRef}
        style={this.props.style}
      />
    )
  }

  componentDidMount () {
    this.canvasElement = this.canvasElementRef.current
    const canvas = this.canvasElement
    const context = canvas.getContext('2d')
    this.canvasContext = context

    this.resize()
  }

  componentDidUpdate () {
    this.resize()
  }

  scroll (scrollPos) {
    this.draw(scrollPos)
  }

  resize () {
    const canvas = this.canvasElement
    const {
      width,
      height,
      scrollPos = 0
    } = this.props
    this.width = width || canvas.offsetWidth
    this.height = height || canvas.offsetHeight
    canvas.width = this.width
    canvas.height = this.height
    this.draw(scrollPos)
  }

  draw (scrollPos) {
    const {
      unit,
      zoom,
      type,
      backgroundColor,
      lineColor,
      textColor,
      direction,
      textFormat
    } = this.props
    const width = this.width
    const height = this.height
    const state = this.state
    const context = this.canvasContext
    const isHorizontal = type === 'horizontal'
    const isDirectionStart = direction === 'start'

    if (backgroundColor === 'transparent') {
      // Clear existing paths & text
      context.clearRect(0, 0, width * 2, height * 2)
    } else {
      // Draw the background
      context.rect(0, 0, width * 2, height * 2)
      context.fillStyle = backgroundColor
      context.fill()
    }

    context.save()
    // context.scale(2, 2)
    context.strokeStyle = lineColor
    context.lineWidth = 1
    context.font = '10px sans-serif'
    context.fillStyle = textColor

    if (isDirectionStart) {
      context.textBaseline = 'top'
    }
    context.translate(0.5, 0)
    context.beginPath()

    const size = isHorizontal ? width : height
    const zoomUnit = zoom * unit
    const minRange = Math.floor(scrollPos * zoom / zoomUnit)
    const maxRange = Math.ceil((scrollPos * zoom + size) / zoomUnit)
    const length = maxRange - minRange

    for (let i = 0; i < length; ++i) {
      const startPos = ((i + minRange) * unit - scrollPos) * zoom

      if (startPos >= -zoomUnit && startPos < size) {
        const [startX, startY] = isHorizontal
          ? [startPos + 3, isDirectionStart ? 12 : height - 12]
          : [isDirectionStart ? 12 : width - 12, startPos - 4]

        let text = `${(i + minRange) * unit}`

        if (textFormat) {
          text = textFormat((i + minRange) * unit)
        }
        if (isHorizontal) {
          context.fillText(text, startX, startY)
        } else {
          context.save()
          context.translate(startX, startY)
          context.rotate(-Math.PI / 2)
          context.fillText(text, 0, 0)
          context.restore()
        }
      }

      for (let j = 0; j < 10; ++j) {
        const pos = startPos + j / 10 * zoomUnit

        if (pos < 0 || pos >= size) {
          continue
        }
        const lineSize = j === 0
          ? isHorizontal ? height : width
          : (j % 2 === 0 ? 8 : 4)

        const [x1, y1] = isHorizontal
          ? [pos, isDirectionStart ? 0 : height - lineSize]
          : [isDirectionStart ? 0 : width - lineSize, pos]
        const [x2, y2] = isHorizontal ? [x1, y1 + lineSize] : [x1 + lineSize, y1]
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
      }
    }
    context.stroke()
    context.restore()
  }
}
