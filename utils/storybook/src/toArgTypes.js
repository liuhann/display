/**
  * 元数据模型样例列表转换到Story Options
  * @param {PelType} list 元数据模型样例列表
  */
function listToStoryBookOptions (list) {
  return list.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {})
}

/**
  * 转换图元基本属性列表到StoryBook的control需要的格式
  * @param {} configProps
  */
export const toArgTypes = (configProps, configEvents) => {
  const result = {}

  if (Array.isArray(configProps)) {
    for (const prop of configProps) {
      result[prop.name] = {
        name: prop.name,
        description: prop.label,
        defaultValue: prop.value || prop.defaultValue
      }
      switch (prop.type) {
        case 'boolean':
          Object.assign(result[prop.name], {
            control: {
              type: 'boolean'
            }
          })
          break
        case 'color':
          Object.assign(result[prop.name], {
            control: {
              type: 'color'
            }
          })
          break
        case 'number':
          Object.assign(result[prop.name], {
            control: {
              type: 'number'
            }
          })
          break
        case 'string':

          switch (prop.control) {
            case 'radio':
              Object.assign(result[prop.name], {
                options: Object.values(prop.options.options),
                control: {
                  type: 'radio'
                }
              })
              break
            case 'uploader':
              Object.assign(result[prop.name], {
                control: {
                  type: 'file'
                }
              })
              break
            default:
              Object.assign(result[prop.name], {
                control: {
                  type: 'text',
                  expanded: true
                }
              })
          }
          break
        case 'enum':
          Object.assign(result[prop.name], {
            control: {
              type: 'select',
              options: prop.options
            }
          })
          break
        case 'object':
          Object.assign(result[prop.name], {
            control: {
              type: 'object'
            }
          })
          break
        case 'array':
          if (prop.items && prop.items.type) {
            if (PelModelMaping[prop.items.type]) {
              Object.assign(result[prop.name], {
                control: {
                  type: 'multi-select',
                  options: listToStoryBookOptions(PelModelMaping[prop.type])
                }
              })
            }
          } else {
            console.warn('数组类型的组件请定义 items.type')
          }
          break
        default:
          if (PelModelMaping[prop.type]) {
            Object.assign(result[prop.name], {
              control: {
                type: 'select',
                options: PelModelMaping[prop.type].map(sample => sample.key)
              }
            })
          }
          break
      }
    }
  }

  result.isRuntime = {
    name: '运行时/编辑态',
    control: { type: 'boolean' }
  }
  result.width = {
    name: '宽度',
    control: { type: 'number' }
  }
  result.height = {
    name: '高度',
    control: { type: 'number' }
  }

  if (Array.isArray(configEvents)) {
    for (const event of configEvents) {
      result[event.name] = {
        action: event.name
      }
    }
  }
  return result
}
