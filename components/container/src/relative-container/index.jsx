import React from 'react'
import { initSelecto, onDragOver, onDrop } from 'selectable-movable'
import { shortid } from './shortid.js'

export default class RelativeContainer extends React.Component {
  constructor () {
    super()
    this.childFcViews = {}
    this.$el = React.createRef()
    this.classShortId = 'drag-' + shortid(6)
  }

  componentDidMount () {
    const { currentFcView, children } = this.props
    for (const child of children || []) {
      const el = document.createElement('div')
      el.className = this.classShortId
      this.$el.current.appendChild(el)
      const childFcView = currentFcView.createChildView({
        el,
        position: child.position,
        component: child.component,
        fcInstanceConfig: child.fcInstanceConfig
      })
      el.fcView = childFcView
      childFcView.loadAndRender()
      this.childFcViews[childFcView.fcId] = childFcView
    }

    if (this.props.containerEdit) {
      this.initDnd()
      this.initSelectDrag()
    } else {
      this.destorySelectDrag()
    }
  }

  // 支持拖拽放置组件
  initDnd () {
    const containerDropNode = onDrop((containerRect, component, event) => {
      this.insertChildElement(component, {
        x: event.clientX - containerRect.x,
        y: event.clientY - containerRect.y
      })
    })

    if (this.$el.current) {
      this.$el.current.removeEventListener('dragover', onDragOver)
      this.$el.current.addEventListener('dragover', onDragOver)
      this.$el.current.removeEventListener('drop', containerDropNode)
      this.$el.current.addEventListener('drop', containerDropNode)
    }
  }

  destorySelectDrag () {
    if (this.selecto) {
      this.selecto.destroy()
    }
    if (this.movableGroup) {
      this.movableGroup.destroy()
    }
    if (this.movableGroup) {
      this.movableGroup.destroy()
    }
  }

  /**
   * 外部编辑完成调用的方法， 此时需要将编辑的属性信息传出外部
   */
  getChildren () {
    const childFcViews = Object.values(this.childFcViews)

    return childFcViews.map(fcView => fcView.serialize())
  }

  initSelectDrag () {
    this.destorySelectDrag()
    const {
      movableGroup,
      movableTarget,
      selecto
    } = initSelecto({
      root: this.$el.current,
      selector: this.classShortId
    })

    this.selecto = selecto
    this.movableGroup = movableGroup
    this.movableTarget = movableTarget
  }

  insertChildElement (component, position) {
    const div = document.createElement('div')
    div.className = this.classShortId

    const childPos = {
      type: 'absolute',
      x: (position.x - component.width / 2),
      y: (position.y - component.height / 2),
      width: component.width,
      height: component.height
    }

    const fcView = this.props.currentFcView.createChildView({
      el: div,
      component,
      position: childPos,
      fcInstanceConfig: {}
    })

    div.fcView = fcView

    fcView.loadAndRender()
    this.childFcViews[fcView.fcId] = fcView
    this.$el.current.appendChild(div)
  }

  render () {
    // 切换到编辑模式
    const containerStyle = {
      width: '100%',
      position: 'relative',
      height: '100%'
    }
    // 作为容器只提供一个div壳子，内部内容在后续填充。并且因为内部内容可能是其他方式渲染的，这里要求render方法不能被重新调用
    return (
      <div clasName='relative-container' ref={this.$el} style={containerStyle}>
        {/* {props && props.children && props.children.map((c, index) => <div key={index} className='relatvie-child edit' data-index={index} id={c.fcid} />)} */}
      </div>
    )
  }
}
