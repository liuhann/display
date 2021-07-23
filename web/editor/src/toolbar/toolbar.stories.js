import Toolbar from './Toolbar.jsx'

export default {
  title: 'Toolbar',
  component: Toolbar,
  argTypes: {
  }
}

export const Primary = args => <Toolbar {...args} />
Primary.args = {
  locked: false
}
