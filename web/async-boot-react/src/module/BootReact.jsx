import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { isArray, isFunction } from '../utils/lang'
import ErrorBoundary from './ErrorBoundary.jsx'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

export default {
  async load (ctx) {
    const options = {
      router: true,
      mode: 'hash'
    }
    Object.assign(options, ctx.bootOpts)
    ctx._routes = []
  },

  async onModuleLoad (module, ctx) {
    if (isArray(module.routes)) {
      ctx._routes = ctx._routes.concat(module.routes)
    } else if (isFunction(module.routes)) {
      ctx._routes = ctx._routes.concat(await module.routes(ctx))
    }
  },

  async started (ctx, next) {
    const Router = () => {
      return (
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                {ctx._routes.map((route, index) => <Route key={index} path={route.path} component={lazy(route.component)} />)}
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      )
    }

    ReactDOM.render(
      <Router />,
      document.getElementById(ctx.bootOpts.mount || 'app')
    )

    await next()
  }
}
