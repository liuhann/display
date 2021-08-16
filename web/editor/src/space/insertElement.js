import _ from 'lodash'
import { DATA_DISPLAY_ELEMENT_ID } from '../const'
import { FCView, FcView } from 'display-view'

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
    component,
    context: {}
  })

  fcView.loadAndRender()
  const uniqueId = _.uniqueId('element_')

  div.className = 'element-wrapper'

  div.setAttribute(DATA_DISPLAY_ELEMENT_ID, uniqueId)
  div.setAttribute('id', uniqueId)
  div.style.position = 'absolute'
  div.style.left = x + 'px'
  div.style.top = y + 'px'
  div.style.width = fcView.width + 'px'
  div.style.height = fcView.height + 'px'
  div.style.border = '1px solid #ccc'
  return div
}
