import React, { useEffect, useState, useContext } from 'react'
import interact from 'interactjs'
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
  const dragRectRef = React.createRef()

  const [sceneX, setSceneX] = useState(0)
  const [sceneY, setSceneY] = useState(0)
  const [dragRect, setDragRect] = useState({})
  const [actionMove, setActionMove] = useState(false)
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
      onComponentEdit: () => {
        if (workspaceRef.current.movableTarget) {
          workspaceRef.current.movableTarget.destory()
        }
      },
      component
    })
    const root = sceneRef.current
    root.appendChild(insertedElementDiv)
  }

  useEffect(() => {
    const root = sceneRef.current

    interact(root).draggable({
      /**
       * 拖拽开始，如果只是点击不会触发拖拽事件。
       */
      onstart: event => {
        if (event.ctrlKey) {
          setActionMove(true)
          this.dragRect.withCtrl = true
        } else {
          this.dragRect.withCtrl = false
        }
        this.dragRect.left = event.x0 - event.rect.left
        this.dragRect.top = event.y0 - event.rect.top
        if (this.actionMove) {
          this.dragRect.visible = false
        } else {
          this.dragRect.visible = true
        }
      },
      /**
       * 拖拽移动
       */
      onmove: event => {
        if (this.actionMove) {
          // 移动模式
          this.translateX += event.dx
          this.translateY += event.dy
        } else {
          // 计算正在拖拽的矩形区域
          this.dragRect.width = event.page.x - event.x0
          this.dragRect.height = event.page.y - event.y0
          // 拖拽多选模式
          // 向右拖拽： 重新计算left
          if (this.dragRect.width < 0) {
            this.dragRect.left = event.pageX - event.target.getBoundingClientRect().x
            this.dragRect.width = -this.dragRect.width
          }
          // 向上拖拽： 重新计算top
          if (this.dragRect.height < 0) {
            this.dragRect.top = event.pageY - event.target.getBoundingClientRect().y
            this.dragRect.height = -this.dragRect.height
          }

          // 判断矩形交叉的元素设置为选中
          this.dragRect.x = this.dragRect.left// - this.screenRect.x - this.screenRect.width / 2 * (1 - this.scale)
          this.dragRect.y = this.dragRect.top// - this.screenRect.y
          for (let element of this.scene.elements) {
            if (intersectRect({
              x: element.x * this.scale + this.translateX,
              y: element.y * this.scale + this.translateY,
              width: element.width * this.scale,
              height: element.height * this.scale
            }, this.dragRect)) {
              element.selected = true
            } else {
              element.selected = false
            }
          }
        }
      },
      /**
       * 拖拽结束
       */
      onend: event => {
        if (this.dragRect.withCtrl) {
          this.actionMove = false
          this.dragRect.withCtrl = false
        }
        this.dragRect.visible = false
        // 取消mouseclick事件的触发
        this.dragRect.dragged = true
      }
    }).styleCursor(false)

    return () => {
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
        <div 
          className='dragRect' ref={dragRectRef}/>
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
