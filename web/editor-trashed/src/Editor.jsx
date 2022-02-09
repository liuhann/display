import React from 'react'
import './editor.css'
import Draggable from 'react-draggable'

export default class Editor extends React.Component {
  constructor () {
    super()
    this.state = {
      windowWidth: window.innerWidth,
      navWidth: 260,
      panelWidth: 340,
      showPanel: true
    }
  }

  render () {
    const handleDrag = (e, data) => {
      this.setState({
        navWidth: this.state.navWidth + data.deltaX
      })
    }

    const handlePanelDrag = (e, data) => {
      this.setState({
        panelWidth: this.state.panelWidth - data.deltaX
      })
    }

    const workspaceWidth = this.state.windowWidth - this.state.navWidth - 10 - this.state.panelWidth
    return (
      <div id='editor'>
        <div className='main-content'>
          <Draggable
            axis='x'
            defaultClassName='nav-drag'
            defaultClassNameDragging='nav-dragging'
            bounds={{ left: 200 }}
            defaultPosition={{ x: this.state.navWidth, y: 0 }}
            onDrag={handleDrag}
          >
            <div />
          </Draggable>

          <Draggable
            axis='x'
            defaultClassName='panel-drag'
            defaultClassNameDragging='nav-dragging'
            defaultPosition={{ x: workspaceWidth + this.state.navWidth, y: 0 }}
            onDrag={handlePanelDrag}
          >
            <div />
          </Draggable>

          <div
            className='nav-wrapper' style={{
              width: this.state.navWidth + 'px'
            }}
          >
            <div className='nav-content'>
              这里是正文
            </div>
          </div>

          <div
            className='main' style={{
              left: (this.state.navWidth + 10) + 'px'
            }}
          >
            <div
              className='workspace' style={{
                right: this.state.showPanel ? (this.state.panelWidth + 'px') : 0
              }}
            />
            <div
              className='panel' style={{
                left: this.state.showPanel ? (workspaceWidth + 'px') : 0
              }}
            >
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}
