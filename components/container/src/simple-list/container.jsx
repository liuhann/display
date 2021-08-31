// eslint-disable-next-line no-unused-vars
import React, { useRef, useEffect, useState } from 'react';
import getStyleProps from '@gw/apollo-standard-basic/src/utils/get_style_props';

const Component = ({
    // 列表数据
    listData,
    listKey,
    // 项目宽高
    itemWidth,
    itemHeight,
    fillUpBody,
    // Slot
    renderItem,
    // 系统级别属性
    currentFcView,
    // 系统属性： 是否是运行时，为true表示运行时
    isRuntime,
    width,
    height,
    ...props
}) => {
    const $el = useRef(null);

    if (isRuntime) {
        // 旧列表数据
        const [itemFcViews, setItemFcViews] = useState([]);

        useEffect(() => {
            if (listData) {
                let listValues = listData;

                if (!Array.isArray(listData)) {
                    listValues = Object.values(listData);
                }

                if (listValues.length && renderItem) {
                    for (let i = 0; i < listValues.length; i++) {
                        if (i < itemFcViews.length) {
                            // 对于已经存在的fcView, 更新scope信息后重新渲染 （可能数据结果与之前相同，则不会进行DOM更新）
                            itemFcViews[i].setScopeVariables({
                                data: listValues[i],
                                i,
                                list: listValues
                            });
                            itemFcViews[i].updateProps();
                        } else {
                            // 不存在的fcView， 新增div并且进行复制fcview 初始化相关处理
                            const div = document.createElement('div'),
                                clonedView = renderItem.cloneView(),

                                itemStyle = {};

                            if (itemWidth) {
                                itemStyle.width = itemWidth + 'px';
                            }
                            if (itemHeight) {
                                itemStyle.height = itemHeight + 'px';
                            }
                            Object.assign(div.style, itemStyle);

                            clonedView.setScopeVariables({
                                data: listValues[i],
                                i,
                                list: listValues
                            });
                            clonedView.interactHandler = currentFcView.interactHandler;
                            $el.current.appendChild(div);
                            clonedView.initPropsAndEvents();
                            clonedView.mount(div);
                            itemFcViews.push(clonedView);
                        }
                    }
                    // 列表长度变短则删除多余的数据
                    while (itemFcViews.length > listValues.length) {
                        const spliced = itemFcViews.splice(-1, 1);

                        // 首先脱离挂载
                        $el.current.removeChild(spliced[0].el);
                        if (spliced.length) {
                            spliced[0].unmount();
                        }
                    }
                }
            }
            setItemFcViews(() => itemFcViews);
        }, [listData]);
    }

    let id = '';

    if (currentFcView && currentFcView.fcInstanceConfig && currentFcView.fcInstanceConfig.guid) {
        id = currentFcView.fcInstanceConfig.guid;
    }

    const style = {
        display: 'flex',
        flexWrap: 'wrap'
    };

    // 合并其他样式属性
    Object.assign(style, getStyleProps(props));

    if (fillUpBody) {
        style.width = '100%';
        style.overflow = 'overlay';
        style.height = '100%';
    } else {
        style.width = width + 'px';
        style.overflow = 'overlay';
        style.height = height + 'px';
    }
    return <div
        ref={$el}
        fcid={id}
        className="simle-list"
        style={style} />;
};

export default Component;
