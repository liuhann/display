/**
 * @author 刘晗
 * @created 2021-01-27
 * @description
 * 对组件变量进行相关解析和处理
 */
import debug from 'debug'
import template from '../template.js'

const log = debug('runtime:variable-handler')

export default class VariableHandler {
  constructor (interpretor, viewManager, pageName) {
    this.interpretor = interpretor
    this.viewManager = viewManager
    this.variableValues = interpretor.getPageVaraiblesValues()
    // 模版字符串处理缓存函数
    this.templateFunctions = {}
    this.updateNodesVisible()
    this.updateFrontSideInteractNodes()
    this.updateNodePositions()
    this.updateNodeDynamicProperties()
    this.pageName = pageName
  }

  /**
     * 按属性变化切换所有图元的显示、隐藏关系
     */
  updateNodesVisible () {
    const visibles = this.interpretor.getNodesVisible()

    for (const nodeId in visibles) {
      try {
        // 更新显示
        const result = template(visibles[nodeId], this.variableValues)
        const fcView = this.viewManager.getComponentView(nodeId, this.pageName)

        if (fcView == null) {
          console.log('fcView not Found', nodeId, this.pageName)
          continue
        }

        if (result === 'false' || result === false) {
          // 更新显示
          fcView.setVisible(false)
        } else {
          fcView.setVisible(true)
        }
      } catch (e) {
        console.log('切换显隐异常', visibles[nodeId], this.variableValues, e)
      }
    }
  }

  /**
     * 更新前端所有按variable值方式获取属性的节点
     * 110->210更新： 对variableName为空的情况，认为是初始化处理，会对每个随变量变动的组件做初始化处理
     */
  updateFrontSideInteractNodes (variableName) {
    // 获取所有联动节点
    const interactNodes = this.interpretor.getVariableEvaluatedNodesByName(variableName)
    const allEvaluatedNodes = this.interpretor.getVariableEvaluatedNodes()

    log('联动的节点', variableName, interactNodes)

    for (const nodeId of interactNodes) {
      const propValues = {}

      // 枚举节点的属性
      for (const propKey in allEvaluatedNodes[nodeId]) {
        if (variableName) {
          // 属性值从变量中获取,定义了变量名称只更新对应变量名的组件
          if (allEvaluatedNodes[nodeId][propKey] === variableName) {
            propValues[propKey] = this.variableValues[allEvaluatedNodes[nodeId][propKey]]
          }
        } else {
          propValues[propKey] = this.variableValues[allEvaluatedNodes[nodeId][propKey]]
        }
      }

      // 更新显示
      this.viewManager.getComponentView(nodeId, this.pageName).updateProps(propValues, this.getPageVariables())
    }
  }

  getSystemVariables () {
    if (this.interpretor.$el) {
      return {
        rootRect: this.interpretor.$el.getBoundingClientRect()
      }
    } else {
      return {
        rootRect: {}
      }
    }
  }

  getPageVariables () {
    return Object.assign({}, this.variableValues, this.getSystemVariables())
  }

  /**
     * 更新节点的位置信息
     */
  updateNodePositions () {
    const positionExpressions = this.interpretor.getPositionExpressions()

    const trace = debug('runtime:position')

    for (const nodeId in positionExpressions) {
      trace('更新节点位置', nodeId)

      try {
        const position = {}

        if (positionExpressions[nodeId].x) {
          position.x = template(positionExpressions[nodeId].x, this.getPageVariables())
        }
        if (positionExpressions[nodeId].y) {
          position.y = template(positionExpressions[nodeId].y, this.getPageVariables())
        }

        trace('更新节点位置', nodeId, position.x, position.y)
        this.viewManager.getComponentView(nodeId, this.pageName).setPosition(position)
      } catch (e) {
        // ignore
        // console.error('更新位置异常: ', positionExpressions[nodeId]);
      }
    }
  }

  /**
     * 页面变量更新后，据此更新所有绑定页面变量的  expressionBind.a.xxx 的所有图元
     * key为空时更新所有图元， key不为空，检测判断只更新使用到key的图元
     */
  updateNodeDynamicProperties (key) {
    const bindings = this.interpretor.nodePropertiesDynamicBindings

    for (const fcId in bindings) {
      try {
        const update = {}

        for (const prop in bindings[fcId]) {
          if (bindings[fcId][prop].indexOf('$scope') === -1 && bindings[fcId][prop].indexOf(key) > -1) {
            update[prop] = template(bindings[fcId][prop], this.getPageVariables())
          }
        }

        if (Object.keys(update).length) {
          const fcView = this.viewManager.getComponentView(fcId, this.pageName)

          if (fcView) {
            log('更新fcView数据', fcId, fcView, update)
            fcView.updateProps(update)
          } else {
            log('fcView未找到', fcId)
          }
        }
      } catch (e) {}
    }
  }

  variableChange (key, value) {
    log('页面变量更新', key, value)
    this.variableValues[key] = value
    this.updateNodesVisible()
    this.updateFrontSideInteractNodes(key)
    this.updateNodePositions()
    this.updateNodeDynamicProperties(key)
  }
}
