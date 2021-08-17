import _ from 'lodash'
import { DATA_DISPLAY_ELEMENT_ID } from '../const'
import { FCView } from 'display-view'

export const insertElement = ({
  x,
  y,
  loader,
  component
}) => {
  const div = document.createElement('div')

  const fcView = new FCView({
    loader,
    el: div,
    fcInstanceConfig: {},
    component: {
      packageName: component.pkg,
      path: component.code,
      dependencies: Object.keys(component.pkgDependencies)
    },
    context: {}
  })
  const uniqueId = _.uniqueId('element_')

  div.className = 'element-wrapper'
  div.setAttribute(DATA_DISPLAY_ELEMENT_ID, uniqueId)
  div.setAttribute('id', uniqueId)
  div.style.position = 'absolute'
  div.style.left = (x - component.width / 2) + 'px'
  div.style.top = (y - component.height / 2) + 'px'
  div.style.width = component.width + 'px'
  div.style.height = component.height + 'px'

  fcView.loadAndRender().then(() => {

  })

  div.fcView = fcView
  return div
}
