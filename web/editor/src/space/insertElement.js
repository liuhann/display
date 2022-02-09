import { FCView } from 'display-view'
import { shortid } from '../../../../components/container/src/relative-container/shortid.js'

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
    fcId: shortid(6),
    el: div,
    component,
    fcInstanceConfig: {},
    position: {
      type: 'absolute',
      x: (x - component.width / 2),
      y: (y - component.height / 2),
      width: component.width,
      height: component.height
    },
    context: {
      loader
    }
  })

  fcView.loadAndRender().then(() => {
    componentReady && componentReady(fcView)
  })
  fcView.el.addEventListener('dblclick', e => {
    if (fcView.componentDefinition.inPlaceEditor) {
      const workspaceEl = document.querySelector('#editor-workspace')
      initOrResizeContainer(workspaceEl, fcView, {
        editorReady: onComponentEdit
      })
    }
  })
  div.fcView = fcView
  return div
}
