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

export const Primary = args => <Ruler {...args} />
Primary.args = {
  type: 'horizontal',
  zoom: 1,
  unit: 50,
  width: 800,
  height: 30,
  direction: 'start',
  scrollPos: 0,
  style: { width: '100%', height: '100%' },
  backgroundColor: '#333333',
  textColor: '#ffffff',
  lineColor: '#777777'
}

export const Vertical = args => <Ruler {...args} />
Vertical.args = {
  type: 'vertical',
  zoom: 1,
  unit: 50,
  width: 30,
  height: 600,
  scrollPos: 0,
  direction: 'start',
  // style: { width: '100%', height: '100%' },
  backgroundColor: '#333333',
  textColor: '#ffffff',
  lineColor: '#777777'
}