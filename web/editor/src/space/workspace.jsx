import React, { useEffect, useState } from 'react'
import Moveable from 'moveable'
import Selecto from 'selecto'
import Ruler from '../ruler/ruler.jsx'
import { DATA_DISPLAY_ELEMENT_ID } from '../const'
import { getParentDisplayElement } from '../utils/utils'
import _ from 'lodash'

const setElementMovable = (root, el) => {
  const otherWrappers = [...document.querySelectorAll('.element-wrapper')].filter(each => each !== el)
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
    renderDirections: ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'],
    edge: false,
    zoom: 1,
    origin: true,
    padding: { left: 0, top: 0, right: 0, bottom: 0 }
  })

  moveable.on('resizeStart', e => {
  }).on('drag', e => {
    const beforeDelta = e.beforeDelta
    e.target.style.left = (parseFloat(e.target.style.left) + beforeDelta[0]) + 'px'
    e.target.style.top = (parseFloat(e.target.style.top) + beforeDelta[1]) + 'px'
  }).on('resize', e => {
    const beforeDelta = e.drag.beforeDelta
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`
    e.target.style.left = (parseFloat(e.target.style.left) + beforeDelta[0]) + 'px'
    e.target.style.top = (parseFloat(e.target.style.top) + beforeDelta[1]) + 'px'
    // e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
  })

  return moveable
}

const setElementsMovable = (root, els) => {
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
    elementGuidelines: [document.querySelector('.element-wrapper')],
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

const initSelecto = ({
  root,
  selector,
  zoom,
  containerDrag
}) => {
  // 单项选择及操作
  let movableTarget = null
  // 多项选择、批量移动的
  let movableGroup = null
  // 是否在移动图纸
  let isMovingContainer = false

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
    selectFromInside: true,
    // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
    continueSelect: false,
    // Determines which key to continue selecting the next target via keydown and keyup.
    toggleContinueSelect: 'shift',
    // zoom: 1 / zoom,
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

    if (inputEvent.ctrlKey) { // 移动整个画面
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
      if (movableGroup) {
        movableGroup.destroy()
        movableGroup = null
      }
      isMovingContainer = true
    } else {
      isMovingContainer = false
      // 如果有选中节点或者群组，判断是否还继续拖拽处理 (选择到了节点就结束拖拽了)
      const fcViewWrapper = getParentDisplayElement(target)
      if (fcViewWrapper) {
        if (movableTarget) {
          if (movableTarget.target !== fcViewWrapper) {
            movableTarget.destroy()
            movableTarget = setElementMovable(root, fcViewWrapper, zoom)
            movableTarget.dragStart(inputEvent)
          }
        } else {
          // 有选中节点，但是没有已存的目标和群组： 选中当前节点
          movableTarget = setElementMovable(root, fcViewWrapper, zoom)
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
    }
  })

  selecto.on('drag', e => {
    if (isMovingContainer) {
      // 隐藏drag层
      e.currentTarget.target.style.display = 'none'
      containerDrag(e)
    }
  })
  selecto.on('dragEnd', (e) => { })
  selecto.on('select', e => {
    if (isMovingContainer) {
      return
    }

    if (e.selected.length === 0) {
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
    } else if (e.selected.length === 1) { // 选择一个节点处理
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
    } else if (e.selected.length > 1) { // 选择超过一个节点
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
      if (movableGroup) {
        movableGroup.destroy()
      }
      movableGroup = setElementsMovable(root, e.selected, zoom)
    }
  })

  return {
    movableGroup,
    movableTarget,
    selecto
  }
}

export default ({
  rootElements, // 文件定义
  width,
  height,
  viewPortWidth = 800,
  viewPortHeight = 600,
  zoom,
  elementChange,
  change // 输出文件定义
}) => {
  const ref = React.createRef()
  const workspaceRef = React.createRef()
  const sceneRef = React.createRef()

  const [sceneX, setSceneX] = useState(0)
  const [sceneY, setSceneY] = useState(0)

  const onDragEnter = event => {
    console.log('drag enter')
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const insertElement = ({
    x,
    y,
    def
  }) => {
    const root = sceneRef.current
    const div = document.createElement('div')

    const uniqueId = _.uniqueId('element_')
    const fcView = {
      id: uniqueId,
      x: x,
      y: y,
      width: 200,
      height: 200
    }
    div.className = 'element-wrapper'

    div.setAttribute(DATA_DISPLAY_ELEMENT_ID, uniqueId)
    div.setAttribute('id', uniqueId)
    div.style.position = 'absolute'
    div.style.left = fcView.x + 'px'
    div.style.top = fcView.y + 'px'
    div.style.width = fcView.width + 'px'
    div.style.height = fcView.height + 'px'
    div.style.border = '1px solid #ccc'
    root.appendChild(div)
  }
  const onDrop = event => {
    const component = JSON.parse(event.dataTransfer.getData('text/plain'))
    console.log('drop ', component)
    const containerRect = event.currentTarget.getBoundingClientRect()

    insertElement({
      x: event.clientX - containerRect.x,
      y: event.clientY - containerRect.y,
      link: component
    })
  }

  useEffect(() => {
    const root = sceneRef.current

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

    const {
      movableGroup,
      movableTarget,
      selecto
    } = initSelecto({
      root: workspaceRef.current,
      selector: '.element-wrapper',
      containerDrag: ({ deltaX, deltaY }) => {
        setSceneX(sceneX => parseFloat(sceneX) + deltaX)
        setSceneY(sceneY => parseFloat(sceneY) + deltaY)
      }
    })

    return () => {
      if (movableGroup) {
        movableGroup.destroy()
      }
      if (movableTarget) {
        movableTarget.destroy()
      }
      selecto.destroy()
      for (const child of root.children) {
        root.removeChild(child)
      }
    }
  }, [])

  const workspaceStyle = {
    position: 'relative',
    background: '#eee',
    overflow: 'hidden',
    height: height + 'px'
  }
  const style = {
    position: 'relative',
    width: width ? width + 'px' : '100%',
    height: height ? height + 'px' : '100%',
    border: '1px solid #eee'
  }
  if (zoom !== 1) {
    style.transform = `scale(${zoom})`
  }

  return (
    <div id='editor-workspace' ref={workspaceRef} style={workspaceStyle}>
      <div className='editing-area' ref={ref} style={style}>
        <div
          onDragOver={onDragEnter}
          onDrop={onDrop}
          className='screen' style={{
            left: (sceneX + 24) + 'px',
            top: (sceneY + 24) + 'px',
            position: 'absolute',
            background: '#fff',
            width: viewPortWidth + 'px',
            height: viewPortHeight + 'px'
          }} ref={sceneRef}
        />
      </div>
      <Ruler
        type='horizontal'
        zoom={zoom}
        unit={50}
        width={width - 24}
        height={24}
        direction='start'
        scrollPos={-sceneX}
        style={{
          position: 'absolute',
          left: '24px',
          top: 0,
          zIndex: 9999
          // width: (width - 24) + 'px',
          // height: '24px'
        }}
        backgroundColor='#333333'
        textColor='#ffffff'
        lineColor='#777777'
      />
      <div
        className='ruler-lt' style={{
          left: 0,
          top: 0,
          zIndex: 9999,
          position: 'absolute',
          width: '24px',
          height: '24px',
          backgroundColor: '#333333'
        }}
      />
      <Ruler
        type='vertical'
        zoom={zoom}
        unit={50}
        width={24}
        height={height}
        scrollPos={-sceneY}
        direction='start'
        style={{
          position: 'absolute',
          left: 0,
          zIndex: 9999,
          top: '24px'
          // width: '24px',
        }}
        backgroundColor='#333333'
        textColor='#ffffff'
        lineColor='#777777'
      />
    </div>
  )
}
