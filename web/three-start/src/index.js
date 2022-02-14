export default {
  routes: [{
    path: '/demo/three',
    Component: import('./run-three.js')
  }, {
    path: '/demo/shape',
    Component: import('./geo-shape.js')
  }, {
    path: '/demo/texture',
    Component: import('./texture.js')
  }]
}
