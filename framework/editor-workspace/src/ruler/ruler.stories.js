import Ruler from './ruler.jsx'

export default {
  title: 'Ruler',
  component: Ruler,
  argTypes: {
    width: {
      control: { type: 'number' }
    },
    height: {
      control: { type: 'number' }
    }
  }
}

export const Primary = Ruler.bind({})
Primary.args = {
  width: 1200,
  height: 800
}
