import { FCView } from 'display-view'

import { initOrResizeContainer } from './container.js'

/**
 * 给布局区域增加组件
 * @returns
 */
export const insertElement = ({
  x,
  y,
  loader,
  component,
  onComponentEdit,
  componentReady
}) => {
  const div = document.createElement('div')

  const fcView = new FCView({
    loader,
    el: div,
    fcInstanceConfig: {},
    component,
    context: {}
  })

  fcView.setPosition({
    type: 'absolute',
    x: (x - component.width / 2),
    y: (y - component.height / 2),
    width: component.width,
    height: component.height
  })

  fcView.loadAndRender().then(() => {
    componentReady && componentReady(fcView)
  })
  fcView.el.addEventListener('dblclick', e => {
    if (fcView.componentDefinition.inPlaceEditor || true) {
      const workspaceEl = document.querySelector('#editor-workspace')
      initOrResizeContainer(workspaceEl, fcView, {
        editorReady: onComponentEdit
      })
      // initSelecto({
      //   root: inlineContainer,
      //   selector: '.element-wrapper'
      // })
    }
    // }
  })
  div.fcView = fcView
  return div
}
