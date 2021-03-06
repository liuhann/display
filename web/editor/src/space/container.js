
/**
 * 初始化容器编辑模板，模板本身对外界编辑区域Resize做出相应调整
 * @param {*} workspaceEl 外界编辑器编辑区空间
 * @param {*} fcViewEl 需要内联编辑的容器组件
 */
const initOrResizeContainer = (workspaceEl, fcView, options) => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const inlineContainer = document.createElement('div')
  el.appendChild(inlineContainer)

  const oldMountEl = fcView.el

  const bc = workspaceEl.getBoundingClientRect()
  const alignRect = () => {
    el.style.zIndex = 1001
    el.style.position = 'absolute'
    el.style.left = bc.x + 'px'
    el.style.top = bc.y + 'px'
    el.style.height = bc.height + 'px'
    el.style.width = bc.width + 'px'
    el.style.background = 'rgba(255, 255, 255, .7)'

    const fcBc = fcView.el.getBoundingClientRect()
    inlineContainer.style.position = 'absolute'
    inlineContainer.style.zIndex = 1002
    inlineContainer.style.boxSizing = 'border-box'
    inlineContainer.style.left = (fcBc.x - bc.x) + 'px'
    inlineContainer.style.top = (fcBc.y - bc.y) + 'px'
    inlineContainer.style.height = fcBc.height + 'px'
    inlineContainer.style.width = fcBc.width + 'px'
    inlineContainer.style.border = '1px solid #778'
  }

  const closeReturn = document.createElement('div')
  closeReturn.innerHTML = '关闭'

  closeReturn.onclick = (e) => {
    const children = fcView.invoke('getChildren')
    const newProps = {
      children,
      containerEdit: false
    }

    fcView.unmount()
    fcView.updateProps(newProps)
    fcView.mount(oldMountEl)
    document.body.removeChild(el)
  }

  el.append(closeReturn)

  alignRect()

  fcView.unmount()

  fcView.updateProps({
    containerEdit: true
  })
  fcView.mount(inlineContainer)

  options.editorReady && options.editorReady()

  // 切换到编辑状态
  // fcView.invoke('edit')

  // inlineContainer.removeEventListener('drop', containerDropNode)
  // inlineContainer.addEventListener('drop', containerDropNode)

  const objResizeObserver = new window.ResizeObserver(function () {
    window.requestAnimationFrame(() => {
      alignRect()
    })
  })
  // 观察图片元素
  objResizeObserver.observe(workspaceEl)
}

export {
  initOrResizeContainer
}
