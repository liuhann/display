import React, { useEffect, useState } from 'react'
import RenderElement from './RenderElement.jsx'
import './hammer'

export default ({
  elements, // 文件定义
  width,
  height,
  zoom,
  change // 输出文件定义
}) => {
  const ref = React.createRef()
  const sceneRef = React.createRef()

  const [panDeltaX, setPanDeltaX] = useState(0)
  const [panDeltaY, setPanDeltaY] = useState(0)

  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const hammer = new Hammer(ref.current)

    hammer.get('pinch').set({ enable: true })

    hammer.on('pinch', ev => {
      console.log('pinch', ev)
    })

    ref.current.addEventListener('mousewheel', function (ev) {
      if (ev.deltaY < 0) {
        setScale(scale => scale + 0.1)
      } else {
        setScale(scale => scale - 0.1)
      }
    })

    hammer.on('pan', ev => {
      if (ev.additionalEvent) {
        setPanDeltaX(ev.deltaX)
        setPanDeltaY(ev.deltaY)
      }
      if (ev.isFinal) {
        setTranslateX(translateX => translateX + ev.deltaX)
        setTranslateY(translateY => translateY + ev.deltaY)
        setPanDeltaX(0)
        setPanDeltaY(0)
      }
    })
  }, [])

  const workspaceStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%'
  }
  const style = {
    position: 'relative',
    width: width ? width + 'px' : '100%',
    height: height ? height + 'px' : '100%',
    boxShadow: '',
    border: '1px solid #eee'
  }

  const screenStyle = {
    transform: `translateX(${translateX + panDeltaX}px) translateY(${translateY + panDeltaY}px) scale(${scale})`,
    position: 'absolute',
    background: '#fff',
    width: width + 'px',
    height: height + 'px'
  }

  return (
    // 整体容器
    <div id='editor-workspace' ref={ref} style={workspaceStyle}>
      <div className='screen' ref={sceneRef} style={screenStyle}>
        {elements.map(el => <RenderElement key={el.id} element={el} />)}
      </div>

    </div>
  )
}
