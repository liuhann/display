import React, { useEffect, useState, useContext } from 'react'

import Ruler from '../ruler/ruler.jsx'
import { initSelecto } from 'selectable-movable'
import { ThemeContext } from 'async-boot-react/src/module/boot-context.js'
import { insertElement } from './insertElement.js'

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
  const theme = useContext(ThemeContext)

  const ref = React.createRef()
  const workspaceRef = React.createRef()
  const sceneRef = React.createRef()

  const [sceneX, setSceneX] = useState(0)
  const [sceneY, setSceneY] = useState(0)
  const [elements, setElements] = useState(rootElements)

  const onDragEnter = event => {
    console.log('drag enter')
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const onDrop = event => {
    event.preventDefault()
    const component = JSON.parse(event.dataTransfer.getData('text/plain'))
    console.log('drop ', component)
    const containerRect = event.currentTarget.getBoundingClientRect()

    const insertedElementDiv = insertElement({
      x: event.clientX - containerRect.x,
      y: event.clientY - containerRect.y,
      loader: theme.fcLoader,
      componentReady: fcView => {
        theme.store.dispatch({
          type: 'element/insert',
          payload: fcView
        })
        // setElements(elements)
      },
      component
    })
    const root = sceneRef.current
    root.appendChild(insertedElementDiv)
  }

  useEffect(() => {
    const root = sceneRef.current

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

  const screenStyle = {
    left: (sceneX + 24) + 'px',
    top: (sceneY + 24) + 'px',
    position: 'absolute',
    background: '#fff',
    width: zoom * viewPortWidth + 'px',
    height: zoom * viewPortHeight + 'px'
  }

  return (
    <div id='editor-workspace' ref={workspaceRef} style={workspaceStyle}>
      <div className='editing-area' ref={ref} style={style}>
        <div
          onDragOver={onDragEnter}
          onDrop={onDrop}
          className='screen' style={screenStyle} ref={sceneRef}
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
        }}
        backgroundColor='#333333'
        textColor='#ffffff'
        lineColor='#777777'
      />
    </div>
  )
}
