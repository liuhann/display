import Nav from './nav.jsx'

export default {
  title: 'Nav',
  component: Nav,
  argTypes: {
    value: {
      control: { type: 'number' }
    },
    tabs: {
      control: { type: 'array' }
    }
  }
}

export const Primary = Nav.bind({})
Primary.args = {}
