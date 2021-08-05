// eslint-disable-next-line no-unused-vars
import React from 'react'
import { toArgTypes } from './fcp_argtype'

/**
 * 根据组件定义默认输出一个可配置化的Story
 * @param def
 * @returns StoryBook CSF
 */
export default def => {
  if (!def.component) {
    return args => <div>请指定组件的component实现</div>
  }
  // 按StoryBook给的标准回调
  const configuration = args => {
    def.props.forEach(prop => {
      if (prop.value && !args[prop.name]) {
        args[prop.name] = prop.value
      }
    })

    if (def.size) {
      if (!args.width) {
        args.width = parseInt(def.size.width)
      }
      if (!args.height) {
        args.height = parseInt(def.size.height)
      }
    }

    // 对于vue组件，直接返回vue 组件对象
    if (def.component.__file) {
      Object.assign(def.component, {
        data: () => args
      })
      return def.component
    } else {
      // react 组件暴露 React的组件实现方式
      return <def.component {...args} />
    }
  }

  configuration.story = {
    name: '属性配置测试',
    argTypes: toArgTypes(def.props, def.events),
    parameters: {
      // 通用的方法将size封装为插件接受的格式
    }
  }
  return configuration
}
