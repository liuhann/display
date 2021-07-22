import FCList from './list.jsx'

export default {
  title: 'FCList',
  component: FCList,
  argTypes: {
    itemData: {
      type: 'object'
    }
  }
}

export const Primary = FCList.bind({})
Primary.args = {
  itemData: [{
    title: '你好',
    img: 'http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg'
  }, {
    title: '你好',
    img: 'http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg'
  }, {
    title: '你好',
    img: 'http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg'
  }, {
    title: '你好',
    img: 'http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg'
  }, {
    title: '你好',
    img: 'http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg'
  }]
}
