import './normalize.css'
import WebBoot from 'web-boot'

import threeDemo from 'three-start'
import flatEditor from 'flat-editor'

const serviceUrl = 'http://localhost'

const app = new WebBoot({
  config: {
    serviceUrl
  },
  packages: [threeDemo, flatEditor],
  started: ctx => {
    ctx.page({})
  }
})

app.startUp()
