import AsyncBootReact from 'async-boot-react'
import editor from 'display-editor'
import { FCLoader } from 'display-render'

const fcLoader = new FCLoader('https://unpkg.com/')

const reactApp = new AsyncBootReact({
  config: {
    serviceUrl: 'http://localhost'
  },
  fcLoader,
  packages: [editor]
})

reactApp.startUp()
