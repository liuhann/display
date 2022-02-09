import Selecto from 'selecto'
import { setElementsMovable, setElementMovable } from './setMovable.js'

export function getParentDisplayElement (el, className) {
  if (!el) {
    return null
  }
  if (el.className.split(' ').indexOf(className) > -1) {
    return el
  }
  return getParentDisplayElement(el.parentElement, className)
}

const initSelecto = ({
  root,
  selector,
  zoom,
  onDragStart, // 选择拖拽开始 （未选择任何组件）
  onElementSelected, // 单个组件选中事件
  onElementMove, // 组件移动
  onElementResize, // 组件调整大小
  containerDrag,
  containerZoom
}) => {
  // 单项选择及操作
  let movableTarget = null
  // 多项选择、批量移动的
  let movableGroup = null
  // 是否在移动图纸
  let isMovingContainer = false

  const selecto = new Selecto({
    // The container to add a selection element
    container: root,
    // Selecto's root container (No transformed container. (default: null)
    rootContainer: null,
    // The area to drag selection element (default: container)
    dragContainer: root,
    // Targets to select. You can register a queryselector or an Element.
    selectableTargets: ['.' + selector],
    // Whether to select by click (default: true)
    selectByClick: true,
    // Whether to select from the target inside (default: true)
    selectFromInside: false,
    // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
    continueSelect: false,
    // Determines which key to continue selecting the next target via keydown and keyup.
    toggleContinueSelect: 'shift',
    // zoom,
    zoom: 1 / zoom,
    // The container for keydown and keyup events
    keyContainer: root,
    // The rate at which the target overlaps the drag area to be selected. (default: 100)
    hitRate: 100
  })

  selecto.on('dragStart', (e) => {
    // e.stop()
    const inputEvent = e.inputEvent
    const target = inputEvent.target

    // 拖拽已经选中的元素控制点、控制层
    if (target.className.indexOf('moveable-control') > -1) {
      e.stop()
      return
    }
    if (target.className.indexOf('moveable-area') > -1) {
      e.stop()
      return
    }

    if (inputEvent.ctrlKey) { // 移动整个画面
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
      if (movableGroup) {
        movableGroup.destroy()
        movableGroup = null
      }
      isMovingContainer = true
    } else {
      isMovingContainer = false
      // 如果有选中节点或者群组，判断是否还继续拖拽处理 (选择到了节点就结束拖拽了)
      const fcViewWrapper = getParentDisplayElement(target, selector)
      if (fcViewWrapper) {
        if (movableTarget) {
          // 已经选择了另外的节点
          if (movableTarget.target !== fcViewWrapper) {
            movableTarget.destroy()
            movableTarget = setElementMovable({
              root,
              el: fcViewWrapper,
              zoom,
              onElementMove,
              onElementResize,
              guideElementSelector: selector
            })
            onElementSelected && onElementSelected(fcViewWrapper)
            movableTarget.dragStart(inputEvent)
          }
        } else {
          // 有选中节点，但是没有已存的目标和群组： 选中当前节点
          movableTarget = setElementMovable({
            root,
            el: fcViewWrapper,
            zoom,
            onElementMove,
            onElementResize,
            guideElementSelector: selector
          })
          onElementSelected && onElementSelected(fcViewWrapper)
          movableTarget.dragStart(inputEvent)
        }
        e.stop()
      } else {
        onDragStart && onDragStart()
        if (movableTarget) {
          movableTarget.destroy()
          movableTarget = null
        }
        if (movableGroup) {
          movableGroup.destroy()
          movableGroup = null
        }
      }
    }
  })

  selecto.on('drag', e => {
    if (isMovingContainer) {
      // 隐藏drag层
      e.currentTarget.target.style.display = 'none'
      containerDrag(e)
    }
  })
  selecto.on('dragEnd', (e) => { })
  selecto.on('select', e => {
    if (isMovingContainer) {
      return
    }

    if (e.selected.length === 0) {
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
    } else if (e.selected.length === 1) { // 选择一个节点处理
      const selectedElement = e.selected[0]
      if (movableTarget) {
        if (movableTarget.target === selectedElement) {
          return
        } else {
          movableTarget.destroy()
          movableTarget = setElementMovable({
            root,
            el: selectedElement,
            zoom,
            onElementMove,
            onElementResize,
            guideElementSelector: selector
          })
          onElementSelected && onElementSelected(movableTarget)
        }
      } else {
        movableTarget = setElementMovable({
          root,
          el: selectedElement,
          zoom,
          onElementMove,
          onElementResize,
          guideElementSelector: selector
        })
        onElementSelected && onElementSelected(movableTarget)
      }

      if (movableGroup) {
        movableGroup.destroy()
        movableGroup = null
      }
    } else if (e.selected.length > 1) { // 选择超过一个节点
      if (movableTarget) {
        movableTarget.destroy()
        movableTarget = null
      }
      if (movableGroup) {
        movableGroup.destroy()
      }
      movableGroup = setElementsMovable(root, e.selected, selector)
    }
  })

  return {
    movableGroup,
    movableTarget,
    selecto
  }
}

export {
  initSelecto,
  Selecto
}
