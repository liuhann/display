
import { createStore } from 'redux'
import reducer from '../store/index.js'

export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackChunkName: "editor" */'./Editor.jsx')
  }],
  onload: async ctx => {
    ctx.store = createStore(reducer)
  }
}
