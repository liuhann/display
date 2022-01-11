import Axis from './Axis.jsx'

// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
  title: 'XY坐标轴',
  name: 'Axis',
  component: Axis,
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
    name: 'xAxises',
    type: 'array',
    value: [{
      domain: [0, 100],
      ticks: 9,
      margin: {
        left: 0,
        right: 0
      }
    }]
  }]
}
