import debug from 'debug';
import template from '../template.js';

const trace = debug('runtime:in');

/**
 * @author 刘晗
 * @description
 * 对组件的事件进行解析和处理
 */
export default class InteractHandler {
    constructor(app, fcViewManager) {
        this.app = app;
        this.fcViewManager = fcViewManager;
    }

    /**
     * 获取/计算打开页面的参数
     * @param {*} params 页面参数对象
     * @param {*} variableValues 页面变量
     * @param {*} payload 事件负载
     * @returns String 计算后的页面名称
     */
    getOpenLinkParamsValue(params, variableValues, payload) {
        const paramsValues = {};

        for (const key in params) {
            paramsValues[params[key].target] = this.getParamValue(params[key], variableValues, payload);
        }
        return paramsValues;
    }

    /**
     * 获取/计算参数的值
     * @param {*} paramConfig 参数配置信息
     * @param {*} variableValues 页面变量
     * @param {*} payload 事件负载
     * @returns String 计算后的页面名称
     */
    getParamValue(paramConfig, variableValues, payload) {
        if (paramConfig) {
            if (paramConfig.setTo === 'set') {
                return paramConfig.source;
            } else if (paramConfig.setTo === 'payloadMapping') {
                if (paramConfig.source === '@payloadMapping') {
                    return payload;
                } else {
                    return payload[paramConfig.source];
                }
            } else if (paramConfig.setTo === 'evaluate') {
                return template(paramConfig.source, Object.assign({}, variableValues, {
                    payload
                }));
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * 解析comonent.in对象，获取组件定义的交互事件，
     * 同时附加交互事件到组件之上
     * @param fcView
     */
    attachInteractTo(fcView) {
        const { app } = this;

        fcView.interactHandler = this;

        if (fcView.fcInstanceConfig) {
            for (const interaction of (fcView.fcInstanceConfig.in || [])) {
                const { event, actions, handler } = interaction;

                // 先进行属性判断
                if (event && actions && actions.length) {
                    // 调用系统方法的事件

                    // 增加事件处理
                    fcView.on(event.name, payload => {
                        trace('Event Fired: ' + event.name, fcView, payload);

                        // 设置页面变量的操作，如果有多个Action都做了设置操作，这里进行合并，最后再调用set
                        let pageVarUpdate = {},
                            // 设置App变量操作，同样要最合并
                            appVarUpdate = {};

                        // 首先进行变量更新的操作
                        for (const action of actions) {
                            // 执行条件判断 不满足不做后面的动作
                            if (action.condition) {
                                try {
                                    const result = template(action.condition, Object.assign({}, app.variableHandler.variableValues, {
                                        payload: payload
                                    }));

                                    if (result === 'false') {
                                        if (trace.enabled) {
                                            trace('条件不满足', action.condition);
                                        }
                                        continue;
                                    }
                                } catch (e) {
                                    trace('交互条件配置执行异常', action.condition, e);
                                    continue;
                                }
                            }
                            if (action.who === 'system') {
                                // 对于更新页面变量数据的处理
                                if (action.name === 'updatePageVariable') {
                                    Object.assign(pageVarUpdate, this.getVariableActionResult(action, payload, app.variableHandler.variableValues));
                                }

                                if (action.name === 'updateAppVariable') {
                                    Object.assign(appVarUpdate, this.getVariableActionResult(action, payload, app.variableHandler.variableValues));
                                }
                                // 处理切换显隐动作
                                if (action.name === 'setShowOrHide') {
                                    for (const sete of action.configures || []) {
                                        const targetFcView = this.fcViewManager.getComponentView(sete.target, fcView.pageId);

                                        if (targetFcView) {
                                            trace('设置组件可见性', sete.target, sete.display);
                                            if (sete.display === 'hide') {
                                                targetFcView.setVisible(false);
                                            } else if (sete.display === 'toggle') {
                                                targetFcView.setVisible(!targetFcView.getVisible());
                                            } else if (sete.display === 'show') {
                                                targetFcView.setVisible(true);
                                            }
                                        } else {
                                            trace('组件未找到', sete.target);
                                        }
                                    }
                                }
                            }
                        }

                        // 服务暂时未支持合并发送数据， 这里循环调用设置
                        if (Object.keys(pageVarUpdate).length) {
                            trace('设置页面变量', pageVarUpdate);
                            for (const key of Object.keys(pageVarUpdate)) {
                                app.setPageVariable(key, pageVarUpdate[key]);
                            }
                        }

                        // 服务暂时未支持合并发送数据， 这里循环调用设置
                        if (Object.keys(appVarUpdate).length) {
                            trace('设置应用变量', appVarUpdate);
                            for (const key of Object.keys(appVarUpdate)) {
                                app.setAppVariable(key, appVarUpdate[key]);
                            }
                        }

                        // 调用方法和打开链接的操作在后面进行处理
                        for (const action of actions) {
                            // 执行条件判断 不满足不做后面的动作
                            if (action.condition) {
                                const result = template(action.condition, Object.assign({}, app.variableHandler.variableValues, {
                                    payload: payload
                                }));

                                if (result === 'false') {
                                    continue;
                                }
                            }
                            if (action.who === 'system') {
                                // 处理方法调用的交互
                                if (action.name === 'invoke') {
                                    for (const invocation of action.configures || []) {
                                        const targetFcView = this.fcViewManager.getComponentView(invocation.target, fcView.pageId);

                                        // 调用方法
                                        targetFcView.invoke(invocation.method);
                                        // TODO 增加方法参数的处理
                                    }
                                }

                                if (action.name === 'openLink') {
                                    if (action.configures && action.configures.length) {
                                        for (const configure of action.configures) {
                                            trace('event open link');
                                            app.openLink({
                                                linkTo: configure.linkTo,
                                                openIn: configure.openIn,
                                                pageName: this.getParamValue(configure.pageName, app.variableHandler.variableValues, payload),
                                                params: this.getOpenLinkParamsValue(configure.params, app.variableHandler.variableValues, payload)
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                // 110版本情况下 定义为handler
                if (event && handler) {
                    // 调用系统方法的事件
                    if (handler.action.who === 'system') {
                        if (handler.action.name === 'updatePageVariable') {
                            // 对于更新页面变量数据的处理
                            fcView.on(event.name, payload => {
                                // 按event的payload对象进行映射写入对应页面变量
                                if (handler.action.payloadMapping) {
                                    if (typeof handler.action.payloadMapping === 'string') {
                                        app.setPageVariable(handler.action.payloadMapping, payload);
                                    } else {
                                        for (const key of Object.keys(handler.action.payloadMapping)) {
                                            // 映射配置了后如果根本没传值就不做更新、 传值为null也要更新为null值
                                            if (typeof payload[key] !== 'undefined') {
                                                const targetVariable = handler.action.payloadMapping[key];

                                                if (typeof targetVariable === 'string') {
                                                    app.setPageVariable(targetVariable, payload[key]);
                                                } else if (Array.isArray(targetVariable)) {
                                                    for (const variable of targetVariable) {
                                                        app.setPageVariable(variable, payload[key]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (handler.action.set) {
                                    // 直接修改页面变量值
                                    for (const key of Object.keys(handler.action.set)) {
                                        app.setPageVariable(key, handler.action.set[key]);
                                    }
                                }
                                if (handler.action.evaluate) {
                                    // 直接修改页面变量值 支持使用模版形式
                                    for (const key of Object.keys(handler.action.evaluate)) {
                                        app.setPageVariable(key, template(handler.action.evaluate[key],
                                            Object.assign({}, app.variableHandler.variableValues, {
                                                payload: payload
                                            })
                                        ));
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }

        this.attachWriteBackEvents(fcView);

        if (fcView.childrenFcViews) {
            for (const childView of fcView.childrenFcViews) {
                // childView.initPropsAndEvents(fcView.contextVariables);
                this.attachInteractTo(childView);
            }
        }
    }

    /**
     * 操作为设置属性变量时处理设置变量值信息， 包括：
     * set: 设置直接值
     * evaluate: 表达式计算值
     * payloadMapping: 负载映射值
     * @param {*} action 操作对象信息
     * @param {*} payload 负载数据
     * @param {*} contextVariables 上下文变量信息
     */
    getVariableActionResult(action, payload, contextVariables) {
        const doSet = {};

        if (action.set) {
            // 直接修改页面变量值
            for (const key of Object.keys(action.set)) {
                doSet[key] = action.set[key];
            }
        }
        if (action.evaluate) {
            // 直接修改页面变量值 支持使用模版形式
            for (const key of Object.keys(action.evaluate)) {
                try {
                    doSet[key] = template(action.evaluate[key],
                        Object.assign({}, contextVariables, {
                            payload: payload
                        })
                    );
                } catch (e) {
                    trace('页面变量模板计算出错', action.evaluate[key]);
                }
            }
        }

        if (action.payloadMapping) {
            for (const key of Object.keys(action.payloadMapping)) {
                // 整体负载的数据映射
                if (key === '@payloadMapping') {
                    doSet[action.payloadMapping[key]] = payload;
                } else {
                    // const payloadKey = key.substr('@payloadMapping'.length + 1);
                    doSet[action.payloadMapping[key]] = payload[key];
                }
            }
        }
        return doSet;
    }

    attachWriteBackEvents(fcView) {
        const { app } = this;

        // 处理所有双向绑定的情形：  propertyWriteBackEvents格式为 { event : propName }
        if (fcView.propertyWriteBackEvents && Object.keys(fcView.propertyWriteBackEvents).length) {
            for (const eventName of Object.keys(fcView.propertyWriteBackEvents)) {
                const propName = fcView.propertyWriteBackEvents[eventName];

                if (fcView.fcInstanceConfig.reactiveProps[propName]) {
                    const propertyExpression = fcView.fcInstanceConfig.reactiveProps[propName];

                    // 含有绑定信息， 确认是否是绑定了变量
                    // 变量中含有 p.name = 'variable'的情况
                    if (app.variableHandler.variableValues[propertyExpression] != null) {
                        fcView.updateProps({
                            [propName]: app.variableHandler.variableValues[propertyExpression]
                        });
                        fcView.on(eventName, val => {
                            fcView.updateProps({
                                [propName]: val
                            });
                            app.setPageVariable(propertyExpression, val);
                        });
                    }
                }
            }
        }
    }
}
