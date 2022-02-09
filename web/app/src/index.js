import AsyncBootReact from 'async-boot-react'
import editor from 'display-editor'
import { FCLoader } from 'display-render'

const serviceUrl = 'http://localhost'

const fcLoader = new FCLoader(serviceUrl)

const reactApp = new AsyncBootReact({
  config: {
    serviceUrl
  },
  fcLoader,
  packages: [editor]
})

reactApp.startUp()
