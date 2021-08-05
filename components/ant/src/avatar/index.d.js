import Avatar from './Avatar.jsx'

// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
  title: '头像',
  name: 'Avatar',
  component: Avatar,
  // 可配置属性列表，具体规则看样例
  argTypes: {
    size: {
      control: {
        type: 'number'
      }
    },
    shape: {
      options: ['square', 'circle'],
      control: {
        type: 'radio'
      }
    },
    alt: {
      control: {
        type: 'text'
      }
    }
  },
  args: {
    size: 48
  },
  externals: []
}
