import AsyncBoot from './booter/AsyncBoot.js'
import editor from 'display-editor'

const app = new AsyncBoot({
  packages: [editor]
})

app.startUp()
