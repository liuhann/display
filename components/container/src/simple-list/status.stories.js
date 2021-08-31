import React from 'react';
import Container from './container.jsx';
// StoryBook CSF格式，同时也是UI组件的描述格式
export default {
    title: 'SimpleList'
};

const render = ({
    item
}) => {
    return <div>{item.value}</div>;
};

/**
 * 下面可以按照StoryBook标准写法进行组件基础测试。 可以不写
 */
export const Basic = () =>
    <Container
        width={960}
        height={480}
        itemWidth={200}
        itemHeight={100}
        renderItem={render}
        listData={[{
            value: 1
        }, {
            value: 2
        }, {
            value: 3
        }, {
            value: 4
        }, {
            value: 5
        }, {
            value: 6
        }, {
            value: 7
        }]}
    />;
Basic.story = {
    name: '基础样例'
};
