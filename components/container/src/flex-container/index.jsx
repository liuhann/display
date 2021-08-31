/* eslint-disable no-unused-vars */
import React from 'react'

const extractMargin = (marginStr) => {
  const marginsSplits = marginStr.split(' ')

  if (marginsSplits.length === 1) {
    return [parseInt(marginsSplits[0]), parseInt(marginsSplits[0]), parseInt(marginsSplits[0]), parseInt(marginsSplits[0])]
  } else if (marginsSplits.length === 2) {
    return [parseInt(marginsSplits[0]), parseInt(marginsSplits[1]), parseInt(marginsSplits[0]), parseInt(marginsSplits[1])]
  } else if (marginsSplits.length === 3) {
    return [parseInt(marginsSplits[0]), parseInt(marginsSplits[1]), parseInt(marginsSplits[2]), parseInt(marginsSplits[1])]
  } else {
    return [parseInt(marginsSplits[0]), parseInt(marginsSplits[1]), parseInt(marginsSplits[2]), parseInt(marginsSplits[3])]
  }
}

export default class FlexContainer extends React.Component {
  constructor (props) {
    super()
    this.props = props
    this.$el = React.createRef()
  }

  componentDidMount () {
    const { childrenViews, currentFcView, direction, alignItems } = this.props

    Object.assign(this.$el.current.style, this.getContainerStyle(this.props))
    this.initFlexContent(childrenViews, currentFcView, direction, alignItems)
  }

  async updateProps (newProps) {
    const {
      // 相关系统变量
      isRuntime,
      currentFcView,
      childrenViews,
      apolloApp,
      direction = 'row',
      alignItems = 'stretch',
      justify = 'flex-start',
      width,
      height,
      ...props
    } = newProps

    if (this.$el.current) {
      Object.assign(this.$el.current.style, this.getContainerStyle(newProps))
    }
    await this.initFlexContent(childrenViews, currentFcView, direction, alignItems)
  }

  async initFlexContent (childrenViews, currentFcView, direction, alignItems) {
    const loadMountViews = []

    if (childrenViews && childrenViews.length) {
      for (let i = 0; i < childrenViews.length; i++) {
        const view = childrenViews[i]
        let div = this.$el.current.children[i]
        let isCreatedChild = false

        if (div == null) {
          isCreatedChild = true
          div = document.createElement('div')
          this.$el.current.appendChild(div)
        }

        div.setAttribute('fcid', view.fcInstanceConfig.guid)

        // 设置子项div的大小
        if (view.instancePropConfig.flex != null) {
          div.style.flex = parseInt(view.instancePropConfig.flex)
        }

        // 水平排列形式
        if (direction === 'row') {
          if (!div.style.flex) {
            div.style.width = view.fcInstanceConfig.width + 'px'
          }
          if (alignItems !== 'stretch') {
            div.style.height = view.fcInstanceConfig.height + 'px'
          }
        } else {
          // 列排列形式
          if (!div.style.flex) { // 按比例获取高度的
            div.style.height = view.fcInstanceConfig.height + 'px'
          }
          if (alignItems !== 'stretch') {
            div.style.width = view.fcInstanceConfig.width + 'px'
          }
        }

        // 设置子项Margin
        if (view.instancePropConfig.styleMargin != null) {
          div.style.margin = view.instancePropConfig.styleMargin

          let innerDiv = div.children[0]

          if (innerDiv == null) {
            isCreatedChild = true
            innerDiv = document.createElement('div')
            div.appendChild(innerDiv)
          }
          innerDiv.style.height = '100%'
          innerDiv.style.width = '100%'
          innerDiv.style.boxSizing = 'border-box'

          if (isCreatedChild) {
            innerDiv.style.background = 'rgba(255, 255, 255, .05)'
            view.el = innerDiv
            loadMountViews.push(view)
          } else if (view.renderer) {
            view.updateProps()
          }
        } else {
          if (isCreatedChild) {
            div.style.background = 'rgba(255, 255, 255, .05)'
            view.el = div
            loadMountViews.push(view)
          } else if (view.renderer) {
            view.updateProps()
          }
        }
      }
    }

    if (loadMountViews.length) {
      for (const view of loadMountViews) {
        await view.loadComponentDefinition()
        view.interactHandler = currentFcView.interactHandler
        view.initPropsAndEvents()
        view.mount()
      }
    }
  }

  getContainerStyle (newProps) {
    const {
      // 相关系统变量
      isRuntime,
      currentFcView,
      childrenViews,
      apolloApp,
      direction = 'row',
      alignItems = 'stretch',
      justify = 'flex-start',
      width,
      height,
      refCallback,
      ...props
    } = newProps
    const containerStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems
    }

    Object.assign(containerStyle, getStyleProps(props))
    delete containerStyle.margin
    return containerStyle
  }

  render () {
    const { refCallback } = this.props

    if (refCallback) {
      refCallback(this)
    }

    let id = ''

    if (this.currentFcView && this.currentFcView.fcInstanceConfig && this.currentFcView.fcInstanceConfig.guid) {
      id = this.currentFcView.fcInstanceConfig.guid
    }

    const containerStyle = this.getContainerStyle(this.props)

    return (
      <div
            id={this.props.domId}
            fcid={id}
            ref={this.$el}
            style={containerStyle}
            className='flex-container'
          />
    )
  }
}
