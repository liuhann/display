import React from 'react'

export default class MaskContainer extends React.Component {
  constructor () {
    super()
    this.state = {

    }
  }

  componentDidMount () {

  }

  componentDidUpdate () {

  }

  render () {
    let workspaceEl = null
    if (this.props.workspaceId) {
      workspaceEl = document.querySelector(this.props.workspaceId)
    }
    const containerStyle = {}
    if (workspaceEl) {
      const bc = workspaceEl.getBoundingClientRect()
      containerStyle.zIndex = 1001
      containerStyle.position = 'absolute'
      containerStyle.left = bc.x + 'px'
      containerStyle.top = bc.y + 'px'
      containerStyle.height = bc.height + 'px'
      containerStyle.width = bc.width + 'px'
      containerStyle.background = 'rgba(255, 255, 255, .2)'
    }
    return (
      <div className='mask' style={containerStyle}>
        <div className='edit-wrapper' />
      </div>
    )
  }
}
