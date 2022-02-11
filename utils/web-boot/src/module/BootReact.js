import React from 'react'
import ReactDOM from 'react-dom'
import { isArray, isFunction } from '../utils/lang'

export default {
  async load (ctx) {
    await import('react')
    await import('react-dom')
  },

  async onModuleLoad (module, ctx) {
  },

  async started (ctx, next) {
    await next()
  }
}
