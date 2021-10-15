import LinePop from './LinePop.jsx'

// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
  title: '直线Pop',
  name: 'LinePop',
  component: LinePop,
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
    name: 'alt',
    type: 'string'
  }, {
    name: 'src',
    type: 'string',
    control: 'file'
  }, {
    name: 'badgeDot',
    type: 'boolean',
    value: false
  }, {
    name: 'badgeCount',
    type: 'number'
  }]
}
