import RelativeContainer from './index.jsx'

// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
  title: '相对布局容器',
  name: 'Rela',
  component: RelativeContainer,
  inPlaceEditor: true,
  // 可配置属性列表，具体规则看样例
  props: [{
    name: 'children',
    label: '子节点列表',
    value: []
  }, {
    label: '容器编辑',
    name: 'containerEdit',
    value: false
  }],
  events: [{
    name: 'componentDropped'
  }, {
    name: 'componentSelected'
  }, {
    name: 'componentSelected'
  }, {
    name: 'componentSelected'
  }]
}
