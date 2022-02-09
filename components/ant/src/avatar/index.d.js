import Avatar from './Avatar.jsx'

// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
  title: '头像',
  name: 'Avatar',
  component: Avatar,
  // 可配置属性列表，具体规则看样例
  props: [{
    name: 'shape',
    type: 'enum',
    options: ['square', 'circle']
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
