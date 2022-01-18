import React from 'react'
import './editor.css'
import WorkSpace from '../space/workspace.jsx'

export default class Editor extends React.Component {
  constructor () {
    super()
    this.state = {
      windowWidth: document.body.offsetWidth,
      windowHeight: document.body.offsetHeight,
      scene: {
        elements: [{
          id: 1,
          x: 10,
          y: 10,
          width: 200,
          height: 300
        }]
      }
    }
  }

  componentDidMount () {
  }

  render () {
    const { windowWidth, navWidth, panelWidth, showPanel, toolbarShow, scene } = this.state
    return (
      <div id='root'>
        <div id='panel-container' />
        <div id='toolbar-container' />
        <WorkSpace elements={scene.elements} width={640} height={480} />
      </div>
    )
  }
}
