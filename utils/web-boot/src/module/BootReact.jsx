import React from 'react'
import ReactDOM from 'react-dom'
import { isArray, isFunction } from '../utils/lang'
import ErrorBoundary from './ErrorBoundary.jsx'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { ThemeContext } from './boot-context.js'

export default {
  async load (ctx) {
    await import('React')
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
        <ThemeContext.Provider value={ctx}>
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  {ctx._routes.map((route, index) => <Route key={index} path={route.path} component={lazy(route.component)} />)}
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </ThemeContext.Provider>
      )
    }

    ReactDOM.render(
      <Router />,
      document.getElementById(ctx.bootOpts.mount || 'app')
    )

    await next()
  }
}
