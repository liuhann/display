import SimpleListContainer from './container.jsx';
import { filterProps } from '@gw/apollo-standard-basic/src/basic_style_props.js';

export default {
    // 组件标题，必填。同时也是Story的标题，也使用时图元的显示名称
    title: '简单列表容器',
    // 图元ID必填，同一个应用包内要求唯一、不重复
    name: 'SimpleListContainer',
    // 图标
    icon: 'icons/list.svg',
    // UI 组件实现，必填
    component: SimpleListContainer,
    // 可配置属性列表，具体规则看样例
    props: [{
        name: 'listData', // row, column
        label: '列表数据',
        type: 'Map',
        control: 'jsoneditor',
        group: '基础'
    }, {
        name: 'listKey',
        label: 'Key字段',
        type: 'string',
        control: 'text',
        group: '基础'
    }, {
        name: 'itemWidth',
        label: '列表项宽度',
        type: 'number',
        control: 'number',
        group: '基础'
    }, {
        name: 'itemHeight',
        label: '列表项高度',
        type: 'number',
        control: 'number',
        group: '基础'
    }, {
        name: 'layout',
        label: '列表项排列',
        type: 'string',
        control: 'text',
        group: '基础'
    }, {
        name: 'fillUpBody',
        label: '填充容器',
        type: 'boolean',
        group: '基础',
        value: false
    }, {
        name: 'renderItem',
        label: '插槽组件ID',
        type: 'string',
        control: 'select',
        optionsFn: editor => {
            const templatedNode = editor.dm.toDatas(n => n.a('template')).toArray(),
                options = {};

            for (const node of templatedNode) {
                options[node.a('guid')] = node.getName() || (node.a('pel') ? node.a('pel').title : '未命名');
            }
            return {
                options
            };
        },
        group: '基础'
    }, ...filterProps(['styleBorderWidth', 'styleBorderColor', 'styleBorderStyle', 'styleBackgroundColor',
        'styleBackgroundPosition', 'styleBorderRadius', 'styleBackgroundImage',
        // BoxShadow
        'enableBoxShadow', 'boxShadowX', 'boxShadowY', 'boxShadowBlur', 'boxShadowColor',
        // Flex
        'isFlex', 'direction', 'justify', 'alignItems'])
    ],
    slots: [{
        name: 'renderItem',
        slotType: 'template',
        label: '列表项内容'
    }],
    events: [],
    // 图元推荐大小
    size: {
        width: 300,
        height: 200
    }
};
