
export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackChunkName: "editor" */'./Editor.jsx')
  }],
  onload: async ctx => {

  }
}
