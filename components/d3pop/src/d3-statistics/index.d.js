import Statistics from './Statistics.jsx'

// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
  title: 'Statistics',
  name: 'Statistics',
  component: Statistics,
  // 可配置属性列表，具体规则看样例
  props: [{
    name: 'series',
    type: 'array',
    value: [10, 19, 27, 34, 40, 45, 49, 52, 54, 55, 55]
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
