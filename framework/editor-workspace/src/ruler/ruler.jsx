import React, { useEffect } from 'react'
import { Ruler } from './ruler-builder'
import './ruler.min.css'

export default ({
  width,
  height
}) => {
  const ref = React.createRef()
  useEffect(() => {
    const rul1 = new Ruler({ container: ref.current })

    return () => {
      rul1.api.destroy()
    }
  }, [width, height])

  const style = {
    position: 'relative',
    width: width ? width + 'px' : '100%',
    height: height ? height + 'px' : '100%'
  }
  return <div id='ruler' ref={ref} style={style} />
}
