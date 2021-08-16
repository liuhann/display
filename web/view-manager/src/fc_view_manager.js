import FrontComponentView from './fc_view.js';
import { FCLoader } from '@gw/fc-render';
import debug from 'debug';
const UNDEFINED_PAGE_ID = 'global',
    log = debug('runtime:fc-view-manager');

/**
 * 前端组件视图管理器，用于创建和获取前端组件操作类 FcView
 */
export default class FCViewManager {
    /**
     * baseUrl: 组态化组件资源服务地址
     * app: 当前应用名称
     */
    constructor({ baseUrl, app, apolloApp }) {
        this.loader = new FCLoader(baseUrl);
        if (app) {
            this.loader.setAppName(app);
        }
        this.apolloApp = apolloApp;
        this.packageVersions = {};

        // 展平后所有的组件， 以分页为单位
        this.componentViews = {};
        // 根上的组件， 以分页为单位
        this.rootComponentViews = {};
    }

    /**
     * 为一个页面创建多个组件服务实例
     * @param {Array} components 组件列表
     * @param {*} opts
     */
    async createComponentViews(components, opts) {
        const options = Object.assign({
            pageId: UNDEFINED_PAGE_ID,
            preloadChild: false
        }, opts);

        if (!this.componentViews[options.pageId]) {
            this.componentViews[options.pageId] = {};
        }

        if (!this.rootComponentViews[options.pageId]) {
            this.rootComponentViews[options.pageId] = {};
        }

        const rootFrontViews = [],
            loading = [];

        for (const component of components) {
            log('创建 fcView：', component);
            try {
                if (opts.rootEl) {
                    opts.rootEl.appendChild(component.el);
                }
                const frontComponentView = new FrontComponentView({
                    fcInstanceConfig: component,
                    loader: this.loader,
                    apolloApp: this.apolloApp,
                    contextVariables: opts.variables,
                    preloadChild: options.preloadChild,
                    pageId: options.pageId
                });

                this.componentViews[options.pageId][frontComponentView.fcId] = frontComponentView;

                // 进行根节点组件加载和渲染
                loading.push(frontComponentView.loadAndRender());

                this.rootComponentViews[options.pageId][frontComponentView.fcId] = frontComponentView;
            } catch (e) {
                console.error(e);
            }
        }
        // 组件的加载进行并行处理
        await Promise.all(loading);

        for (const frontComponentView of Object.values(this.rootComponentViews[options.pageId])) {
            try {
                // 获取子节点也给到全局，便于节点的查找
                const childrenViews = frontComponentView.getLayoutChildrenViews();

                if (childrenViews.length) {
                    for (const childView of childrenViews) {
                        if (childView.fcId) {
                            this.componentViews[options.pageId][childView.fcId] = childView;
                        }
                    }
                }
                rootFrontViews.push(frontComponentView);
            } catch (e) {
                console.error(e);
            }
        }

        this.rootFrontViews = rootFrontViews;
        const tree = this.printFrontViewTree(rootFrontViews);

        console.log('View Tree', tree);

        this.attachResizeObserver(opts.rootEl, this.rootComponentViews[options.pageId]);

        // 处理组件之间可能有的相互引用的情况，必须得要所有组件都初始化完成后才能拿到对方链接
        for (const fcView of Object.values(this.componentViews[options.pageId])) {
            fcView.initLink(this.componentViews[options.pageId]);
        }
        // this.layoutPageViews(options.pageId);
    }

    attachResizeObserver(el, fcViews) {
        // 这个方式监听可能会有其他影响 暂时去除。 resize布局由外面去触发
        // const resizeObserver = new ResizeObserver(entries => {
        //     if (Object.values(fcViews)) {
        //         for (const fcView of Object.values(fcViews)) {
        //             fcView.layout();
        //         }
        //     }
        // });

        // resizeObserver.observe(el);
    }

    renderPageOn(pageId, el) {
        const viewSet = this.rootComponentViews[pageId];

        if (Object.values(viewSet)) {
            for (const fcView of Object.values(viewSet)) {
                el.appendChild(fcView.el);
                fcView.mount();
            }
        }
        this.attachResizeObserver(el, viewSet);
    }

    mount(div, elements) {
        for (const element of elements) {
            div.appendChild(element.el);
        }
    }

    printFrontViewTree(rootFrontViews) {
        const result = {};

        for (const view of rootFrontViews) {
            if (view.fcInstanceConfig.guid) {
                result[view.fcInstanceConfig.guid] = {
                };
                if (view.childrenFcViews && view.childrenFcViews.length) {
                    result[view.fcInstanceConfig.guid].children = this.printFrontViewTree(view.childrenFcViews);
                }
            }
        }

        return result;
    }

    async layoutPageViews(pageId) {
        const pageViews = this.componentViews[pageId];

        for (const fcView of Object.values(pageViews)) {
            fcView.layout();
        }
    }

    async createComponentView(component, opts) {
        try {
            const frontComponentView = new FrontComponentView(component, this.loader, opts.useLatestFCVersion);

            await frontComponentView.loadAndRender();
            this.componentViews[opts.pageId][component.guid] = frontComponentView;

            return frontComponentView;
        } catch (e) {
            console.error('Error Create View', e);
            return null;
        }
    }

    getComponentViews(pageId = UNDEFINED_PAGE_ID) {
        return Object.values(this.componentViews[pageId]);
    }

    /**
     * 获取页面的所有根组件实例
     * @param pageId
     * @returns {unknown[]|*[]}
     */
    getRootComponentViews(pageId = UNDEFINED_PAGE_ID) {
        if (this.rootComponentViews[pageId]) {
            return Object.values(this.rootComponentViews[pageId]);
        } else {
            return [];
        }
    }

    getComponentView(componentId, pageId = UNDEFINED_PAGE_ID) {
        if (this.componentViews[pageId]) {
            return this.componentViews[pageId][componentId];
        } else {
            for (const pageViews of Object.values(this.componentViews)) {
                if (pageViews[componentId]) {
                    return pageViews[componentId];
                }
            }
        }
    }

    detachPage(pageId) {
        if (pageId && this.componentViews[pageId]) {
            for (const fcView of Object.values(this.componentViews[pageId])) {
                fcView.unmount();
            }
        }
    }

    /**
     * 销毁指定页面或者所有页面的组件渲染
     * @param pageId
     */
    destroy(pageId) {
        if (pageId) {
            if (this.componentViews[pageId]) {
                for (const fcView of Object.values(this.componentViews[pageId])) {
                    fcView.renderer.destroy();
                }
            }
        } else {
            for (const page of Object.values(this.componentViews)) {
                for (const fcView of Object.values(page)) {
                    fcView.renderer.destroy();
                }
            }
        }
    }
}
