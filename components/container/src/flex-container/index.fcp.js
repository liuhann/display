import FlexBoxContainer from './index.jsx'
import { filterProps } from '@gw/apollo-standard-basic/src/basic_style_props.js'

export default {
  // 组件标题，必填。同时也是Story的标题，也使用时图元的显示名称
  title: '弹性容器',
  // 图元ID必填，同一个应用包内要求唯一、不重复
  name: 'FlexBoxContainer',
  // 图标
  icon: 'icons/flex.svg',
  // UI 组件实现，必填
  component: FlexBoxContainer,
  // 特殊容器类型
  type: 'FlexBoxContainer',
  // 可配置属性列表，具体规则看样例
  props: [{
    name: 'direction', // row, column
    label: '排列方向',
    type: 'string',
    control: 'select',
    options: {
      options: {
        row: '横向',
        column: '纵向'
      }
    },
    value: 'row',
    group: '基础'
  }, {
    name: 'justify', // start,center, end,space-between, space-around
    label: '主轴对齐',
    type: 'string',
    control: 'select',
    options: {
      options: {
        'flex-start': '靠左/靠上',
        'flex-end': '靠右/靠下',
        center: '居中',
        'space-around': '空白两侧平分',
        'space-between': '空白间隔平分'
      }
    },
    value: 'flex-start',
    group: '基础'
  }, {
    name: 'alignItems', // top middle bottom
    label: '交叉对齐',
    type: 'string',
    control: 'select',
    options: {
      options: {
        'flex-start': '顶部/左侧',
        'flex-end': '底部/右侧',
        center: '居中',
        stretch: '拉伸'
      }
    },
    value: 'stretch',
    group: '基础'
  }, {
    name: 'domId',
    label: '元素ID',
    type: 'string',
    group: '基础',
    value: ''
  }, {
    name: 'fillUpBody',
    label: '填充容器',
    type: 'boolean',
    group: '基础',
    value: false
  }, ...filterProps(['styleBorderWidth', 'styleBorderColor', 'styleBorderStyle', 'styleBorderRadius',
    'styleBackgroundPosition', 'styleBackgroundImage', 'styleBackgroundSize', 'styleBackgroundRepeat', 'styleBackgroundColor', 'styleBackgroundSize',
    'boxShadowX', 'boxShadowY', 'boxShadowBlur', 'boxShadowColor', 'styleMargin'])
  ],
  events: [],
  // 图元推荐大小
  size: {
    width: 300,
    height: 200
  }
}
