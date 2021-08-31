import React from 'react'

export default class RelativeContainer extends React.Component {
  constructor () {
    super()
    this.state = {
      edit: false
    }
    this.$el = React.createRef()
  }

  editMode (mode) {
    this.setState({
      edit: mode
    })
  }

  initContainerDrop () {

  }

  componentDidMount () {
    this.props.currentFcView && this.props.currentFcView.componentDidMount()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    this.props.currentFcView && this.props.currentFcView.componentDidUpdate()
  }

  render () {
    const { props } = this
    if (this.state.edit) {
      // 切换到编辑模式

    } else {
      // 运行模式
      return (
        <div clasName='relative-contaienr runtime' ref={this.$el}>
          {props && props.children && props.children.map((c, index) => <div key={index} className='relatvie-child runtime' data-index={index} />)}
        </div>
      )
    }
  }
}
