import React, { useEffect } from 'react'
import Moveable from 'moveable'
import Selecto from 'selecto'

const setElementMovable = (root, el) => {
  const moveable = new Moveable(root, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    // target: [].slice.call(document.querySelectorAll('.element-wrapper')),
    target: el,
    resizable: true,
    draggable: true,
    snappable: true,
    keepRatio: false,
    throttleResize: 0,
    renderDirections: ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'],
    edge: false,
    zoom: 1,
    origin: true,
    // verticalGuidelines: [100, 200, 300],
    // horizontalGuidelines: [0, 100, 200],
    // elementGuidelines: [document.querySelectorAll('.element-wrapper')],
    padding: { left: 0, top: 0, right: 0, bottom: 0 }
  })

  moveable.on('resizeStart', e => {
    // e.setOrigin(['%', '%'])
    // e.dragStart && e.dragStart.set(frame.translate)
  }).on('drag', e => {
    const beforeDelta = e.beforeDelta
    e.target.style.left = (parseInt(e.target.style.left) + beforeDelta[0]) + 'px'
    e.target.style.top = (parseInt(e.target.style.top) + beforeDelta[1]) + 'px'
  }).on('resize', e => {
    const beforeDelta = e.drag.beforeDelta
    // frame.translate = beforeTranslate
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`
    e.target.style.left = (parseInt(e.target.style.left) + beforeDelta[0]) + 'px'
    e.target.style.top = (parseInt(e.target.style.top) + beforeDelta[1]) + 'px'
    // e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
  })

  return moveable
}

export default ({
  rootElements, // 文件定义
  width,
  height,
  change // 输出文件定义
}) => {
  const ref = React.createRef()
  useEffect(() => {
    const root = ref.current
    for (const element of rootElements) {
      const div = document.createElement('div')
      div.className = 'element-wrapper'

      div.setAttribute('fcid', element.id)
      div.setAttribute('id', element.id)
      div.style.position = 'absolute'
      div.style.left = element.x + 'px'
      div.style.top = element.y + 'px'
      div.style.width = element.width + 'px'
      div.style.height = element.height + 'px'

      root.appendChild(div)
    }

    const selecto = new Selecto({
      // The container to add a selection element
      container: root,
      // Selecto's root container (No transformed container. (default: null)
      rootContainer: null,
      // The area to drag selection element (default: container)
      dragContainer: root,
      // Targets to select. You can register a queryselector or an Element.
      selectableTargets: ['.element-wrapper'],
      // Whether to select by click (default: true)
      selectByClick: true,
      // Whether to select from the target inside (default: true)
      selectFromInside: true,
      // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
      continueSelect: false,
      // Determines which key to continue selecting the next target via keydown and keyup.
      toggleContinueSelect: 'shift',
      // The container for keydown and keyup events
      keyContainer: window,
      // The rate at which the target overlaps the drag area to be selected. (default: 100)
      hitRate: 100
    })
    let movableTarget = null
    selecto.on('dragStart', (e) => {
      // e.stop()
      const inputEvent = e.inputEvent
      const target = inputEvent.target

      if (target && target.getAttribute('fcid')) {
        if (movableTarget) {
          movableTarget.destroy()
        }
        movableTarget = setElementMovable(root, target)
        e.stop()
      } else {
        if (movableTarget) {
          movableTarget.destroy()
          movableTarget = null
        }
      }
    })
    selecto.on('dragEnd', (e) => {
      // e.stop()
      if (e.datas.startSelectedTargets.length) {
        movableTarget = setElementMovable(root, e.datas.startSelectedTargets[0])
      }
      console.log('drag End', e)
    })
  }, [])

  const style = {
    position: 'relative',
    width: width ? width + 'px' : '100%',
    height: height ? height + 'px' : '100%',
    border: '1px solid #eee'
  }

  return <div id='space' style={style} ref={ref} />
}
