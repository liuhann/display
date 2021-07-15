import React, { useEffect } from 'react'
import Moveable from 'moveable'
import Selecto from 'selecto'
import { DATA_DISPLAY_ELEMENT_ID } from '../const'
import { getParentDisplayElement } from '../utils/utils'

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
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`
    e.target.style.left = (parseInt(e.target.style.left) + beforeDelta[0]) + 'px'
    e.target.style.top = (parseInt(e.target.style.top) + beforeDelta[1]) + 'px'
    // e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
  })

  return moveable
}

const setElementsMovable = (root, els) => {
  const moveable = new Moveable(root, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    // target: [].slice.call(document.querySelectorAll('.element-wrapper')),
    target: els,
    defaultGroupRotate: 0,
    defaultGroupOrigin: '50% 50%',
    draggable: true,
    throttleDrag: 0,
    keepRatio: false,
    resizable: true,
    startDragRotate: 0,
    throttleDragRotate: 0,
    zoom: 1,
    origin: true,
    padding: { left: 0, top: 0, right: 0, bottom: 0 }
  })

  moveable.on('dragGroupStart', ({ events }) => {

  }).on('dragGroup', ({ events }) => {
    events.forEach((ev, i) => {
      const beforeDelta = ev.beforeDelta
      ev.target.style.left = (parseInt(ev.target.style.left) + beforeDelta[0]) + 'px'
      ev.target.style.top = (parseInt(ev.target.style.top) + beforeDelta[1]) + 'px'

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
      ev.target.style.left = (parseInt(ev.target.style.left) + beforeDelta[0]) + 'px'
      ev.target.style.top = (parseInt(ev.target.style.top) + beforeDelta[1]) + 'px'
    })
  })

  return moveable
}

const initSelecto = (root, selector) => {
  // 单项选择及操作
  let movableTarget = null
  // 多项选择、批量移动的
  let movableGroup = null
  const selecto = new Selecto({
    // The container to add a selection element
    container: root,
    // Selecto's root container (No transformed container. (default: null)
    rootContainer: null,
    // The area to drag selection element (default: container)
    dragContainer: root,
    // Targets to select. You can register a queryselector or an Element.
    selectableTargets: [selector],
    // Whether to select by click (default: true)
    selectByClick: true,
    // Whether to select from the target inside (default: true)
    selectFromInside: false,
    // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
    continueSelect: false,
    // Determines which key to continue selecting the next target via keydown and keyup.
    toggleContinueSelect: 'shift',
    // The container for keydown and keyup events
    keyContainer: window,
    // The rate at which the target overlaps the drag area to be selected. (default: 100)
    hitRate: 100
  })

  selecto.on('dragStart', (e) => {
    // e.stop()
    const inputEvent = e.inputEvent
    const target = inputEvent.target

    // 拖拽已经选中的元素控制点、控制层
    if (target.className.indexOf('moveable-control') > -1) {
      e.stop()
      return
    }
    if (target.className.indexOf('moveable-area') > -1) {
      e.stop()
      return
    }

    // 如果有选中节点或者群组，判断是否还继续拖拽处理
    const fcViewWrapper = getParentDisplayElement(target)
    if (fcViewWrapper) {
      if (movableTarget) {
        if (movableTarget.target !== fcViewWrapper) {
          movableTarget.destroy()
          movableTarget = setElementMovable(root, fcViewWrapper)
          movableTarget.dragStart(inputEvent)
        }
      } else {
        // 有选中节点，但是没有已存的目标和群组： 选中当前节点
        movableTarget = setElementMovable(root, fcViewWrapper)
        movableTarget.dragStart(inputEvent)
      }
      e.stop()
    } else {
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
      if (movableGroup) {
        movableGroup.destroy()
        movableGroup = null
      }
    }
  })
  selecto.on('dragEnd', (e) => { })
  selecto.on('select', e => {
    if (e.selected.length === 0) {
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
    }

    // 选择一个节点处理
    if (e.selected.length === 1) {
      const selectedElement = e.selected[0]
      if (movableTarget) {
        if (movableTarget.target === selectedElement) {
          return
        } else {
          movableTarget.destroy()
          movableTarget = setElementMovable(root, selectedElement)
        }
      } else {
        movableTarget = setElementMovable(root, selectedElement)
      }

      if (movableGroup) {
        movableGroup.destroy()
        movableGroup = null
      }
    }

    // 选择超过一个节点
    if (e.selected.length > 1) {
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
      if (movableGroup) {
        movableGroup.destroy()
      }
      movableGroup = setElementsMovable(root, e.selected)
    }
  })
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

      div.setAttribute(DATA_DISPLAY_ELEMENT_ID, element.id)
      div.setAttribute('id', element.id)
      div.style.position = 'absolute'
      div.style.left = element.x + 'px'
      div.style.top = element.y + 'px'
      div.style.width = element.width + 'px'
      div.style.height = element.height + 'px'
      div.style.border = '1px solid #ccc'

      root.appendChild(div)
    }

    initSelecto(root, '.element-wrapper')

  }, [])

  const style = {
    position: 'relative',
    width: width ? width + 'px' : '100%',
    height: height ? height + 'px' : '100%',
    border: '1px solid #eee'
  }

  return <div id='space' style={style} ref={ref} />
}
