import React from 'react'
import { initSelecto, onDragOver, onDrop } from 'selectable-movable'

export default class RelativeContainer extends React.Component {
  constructor () {
    super()
    this.childFcViews = {}
    this.state = {
    }
    this.$el = React.createRef()
  }

  initContainerDrop () {

  }

  componentDidMount () {
    const { currentFcView, children } = this.props
    for (const child of children) {
      const el = document.getElementById(child.fcid)
      const childFcView = currentFcView.createChildView({
        el,
        component: child.component,
        instanceConfig: child.config
      })
      childFcView.loadAndRender()
      this.childFcViews[childFcView.uuid] = childFcView
    }

    if (this.props.containerEdit) {
      this.initDnd()
    }
  }

  /**
   * 数据更新， 重新检查所有childFcView、处理子节点interact
   */
  componentDidUpdate (prevProps, prevState, snapshot) {
    const { currentFcView, children } = this.props

    for (const child of children || []) {
      if (!this.childFcViews[child.fcid]) {
        const el = document.getElementById(child.fcid)
        const childFcView = currentFcView.createChildView({
          el,
          component: child.component,
          instanceConfig: child.config
        })
        childFcView.loadAndRender()
        this.childFcViews[child.fcid] = childFcView
      }
    }
  }

  // 支持拖拽放置组件
  initDnd () {
    const containerDropNode = onDrop((containerRect, component, event) => {
      this.props.componentDropped && this.props.componentDropped({
        component: component,
        x: event.clientX,
        y: event.clientY
      })
    })

    if (this.$el.current) {
      this.$el.current.removeEventListener('dragover', onDragOver)
      this.$el.current.addEventListener('dragover', onDragOver)
      this.$el.current.removeEventListener('drop', containerDropNode)
      this.$el.current.addEventListener('drop', containerDropNode)
    }
  }

  render () {
    const { props } = this
    // 切换到编辑模式
    return (
      <div clasName='relative-contaienr' ref={this.$el}>
        {props && props.children && props.children.map((c, index) => <div key={index} className='relatvie-child edit' data-index={index} id={c.fcid} />)}
      </div>
    )
  }
}
