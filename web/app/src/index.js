import AsyncBootReact from 'async-boot-react'
import editor from 'display-editor'

const reactApp = new AsyncBootReact({
  packages: [editor]
})

reactApp.startUp()
