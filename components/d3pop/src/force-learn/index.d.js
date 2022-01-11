import Lession1 from './Lession1.jsx'

// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
  title: 'Lession1',
  name: 'Lession1',
  component: Lession1,
  // 可配置属性列表，具体规则看样例
  props: [{
    name: 'series',
    type: 'array',
    value: [{
      value: 100
    }, {
      value: 120
    }, {
      value: 20
    }, {
      value: 80
    }, {
      value: 90
    }]
  }, {
    name: 'colorFrom',
    type: 'color',
    value: 'brown'
  }, {
    name: 'colorTo',
    type: 'color',
    value: 'steelblue'
  }]
}
