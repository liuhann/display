import WorkSpace from './workspace.jsx'

export default {
  title: 'Space',
  component: WorkSpace,
  argTypes: {
    width: {
      control: { type: 'number' }
    },
    height: {
      control: { type: 'number' }
    },
    rootElements: {
      control: {
        type: 'object'
      }
    }
  }
}

export const Primary = WorkSpace.bind({})
Primary.args = {
  rootElements: [{
    id: 'abcd',
    x: 24,
    y: 40,
    width: 200,
    height: 200
  }, {
    id: 'abcd',
    x: 60,
    y: 100,
    width: 200,
    height: 200
  }],
  width: 1200,
  height: 800
}
