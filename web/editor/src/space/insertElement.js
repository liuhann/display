import { FCView } from 'display-view'

export const insertElement = ({
  x,
  y,
  loader,
  componentReady,
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

  div.fcView = fcView
  return div
}
