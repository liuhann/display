
export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackChunkName: "editor" */'./editor/Editor.jsx')
  }],
  onload: async ctx => {
  }
}
