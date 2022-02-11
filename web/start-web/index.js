import WebBoot from 'web-boot'

import threeDemo from 'three-start'

const serviceUrl = 'http://localhost'

const app = new WebBoot({
  config: {
    serviceUrl
  },
  packages: [threeDemo]
})

app.startUp()
