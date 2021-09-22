import Moveable from 'moveable'
import './style.css'

const setElementMovable = ({ root, el, zoom, onElementMove, onElementResize, guideElementSelector = '.element-wrapper' }) => {
  const otherWrappers = [...document.querySelectorAll(guideElementSelector)].filter(each => each !== el)
  const moveable = new Moveable(root, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    // target: [].slice.call(document.querySelectorAll('.element-wrapper')),
    target: el,
    resizable: true,
    draggable: true,
    snappable: true,
    snapCenter: true,
    keepRatio: false,
    throttleResize: 0,
    elementGuidelines: otherWrappers,
    className: 'my-movable',
    renderDirections: ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'],
    edge: false,
    zoom: zoom,
    origin: true,
    padding: { left: 0, top: 0, right: 0, bottom: 0 }
  })

  moveable.isDisplayInnerSnapDigit = true

  moveable.on('resizeStart', e => {
  }).on('drag', e => {
    const beforeDelta = e.beforeDelta
    onElementMove && onElementMove({
      x: (parseFloat(e.target.style.left) + beforeDelta[0] * zoom),
      y: (parseFloat(e.target.style.top) + beforeDelta[1] * zoom)
    })
    // e.target.fcView && e.target.fcView.setPosition({
    //   x: (parseFloat(e.target.style.left) + beforeDelta[0]),
    //   y: (parseFloat(e.target.style.top) + beforeDelta[1])
    // })
    // e.target.style.left = (parseFloat(e.target.style.left) + beforeDelta[0]) + 'px'
    // e.target.style.top = (parseFloat(e.target.style.top) + beforeDelta[1]) + 'px'
  }).on('resize', e => {
    const beforeDelta = e.drag.beforeDelta
    onElementResize && onElementResize({
      width: e.width,
      height: e.height,
      x: (parseFloat(e.target.style.left) + beforeDelta[0] * zoom),
      y: (parseFloat(e.target.style.top) + beforeDelta[1] * zoom)
    })
    // e.target.fcView && e.target.fcView.setPosition({
    //   width: e.width,
    //   height: e.height,
    //   x: (parseFloat(e.target.style.left) + beforeDelta[0]),
    //   y: (parseFloat(e.target.style.top) + beforeDelta[1])
    // })

    // e.target.style.width = `${e.width}px`
    // e.target.style.height = `${e.height}px`
    // e.target.style.left = (parseFloat(e.target.style.left) + beforeDelta[0]) + 'px'
    // e.target.style.top = (parseFloat(e.target.style.top) + beforeDelta[1]) + 'px'
    // e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
  })

  return moveable
}

const setElementsMovable = (root, els, guideElementSelector = '.element-wrapper') => {
  const moveable = new Moveable(root, {
    target: els,
    defaultGroupRotate: 0,
    defaultGroupOrigin: '50% 50%',
    draggable: true,
    throttleDrag: 0,
    keepRatio: false,
    zoom: 1,
    resizable: true,
    startDragRotate: 0,
    throttleDragRotate: 0,
    elementGuidelines: [document.querySelector(guideElementSelector)],
    origin: true,
    padding: { left: 0, top: 0, right: 0, bottom: 0 }
  })

  moveable.on('dragGroupStart', ({ events }) => {

  }).on('dragGroup', ({ events }) => {
    events.forEach((ev, i) => {
      const beforeDelta = ev.beforeDelta
      ev.target.style.left = (parseFloat(ev.target.style.left) + beforeDelta[0]) + 'px'
      ev.target.style.top = (parseFloat(ev.target.style.top) + beforeDelta[1]) + 'px'

      // frames[i].translate = ev.beforeTranslate
      //   ev.target.style.transform =
      //       `translate(${ev.beforeTranslate[0]}px, ${ev.beforeTranslate[1]}px)`
    })
  }).on('resizeGroup', ({ events }) => {
    events.forEach((ev, i) => {
      console.log('resize fe', ev)
      const beforeDelta = ev.drag.beforeDelta
      // frame.translate = beforeTranslate
      ev.target.style.width = `${ev.width}px`
      ev.target.style.height = `${ev.height}px`
      ev.target.style.left = (parseFloat(ev.target.style.left) + beforeDelta[0]) + 'px'
      ev.target.style.top = (parseFloat(ev.target.style.top) + beforeDelta[1]) + 'px'
    })
  })

  return moveable
}

export {
  Moveable,
  setElementMovable,
  setElementsMovable
}
