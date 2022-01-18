import React, { useEffect } from 'react'

export default ({
  element, // 组件定义
  scale,
  selected,
  width,
  height
}) => {
  const ref = React.createRef()
  const elementClicked = () => {

  }

  const initDragResize = () => {

  }

  useEffect(() => {
    if (selected) {
      initDragResize()
    }
  }, [selected])

  const RenderContent = el => {
    if (el.fcp) {
      return null
    } else {
      return null
    }
  }

  const elementStyle = {
    width: width + 'px',
    height: height + 'px'
  }
  return (
    <div ref={ref} id={'element-' + element.id} style={elementStyle} className='element' onClick={elementClicked}>
      <RenderContent el={element} />
      {selected && <div className='hand-lt' />}
      {selected && <div className='hand-br' />}
    </div>
  )
}
