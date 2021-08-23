import React from 'react'
import './editor.css'
import Draggable from 'react-draggable'
import NavLeft from '../nav-left/NavLeft.jsx'
import WorkSpace from '../space/workspace.jsx'
import Toolbar from '../toolbar/Toolbar.jsx'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { ThemeContext } from 'async-boot-react/src/module/boot-context.js'

import { AssetDAO } from 'display-web-data'

import toTreeData from '../model/toTreeData.js'

export default class Editor extends React.Component {
  constructor () {
    super()
    this.state = {
      windowWidth: document.body.offsetWidth,
      windowHeight: document.body.offsetHeight,
      navWidth: 260,
      panelWidth: 340,
      showPanel: true,
      treeData: [],
      toolbarShow: {
        scale: 1,
        fullScreen: false
      }
    }
  }

  static contextType = ThemeContext

  componentDidMount () {
    this.doStartEditor()
  }

  async doStartEditor () {
    this.fetchAssetTree()
  }

  async fetchAssetTree () {
    const { config  } = this.context
    console.log('context store', this.context.store)
    this.assetDao = new AssetDAO(config.serviceUrl)
    const assets = await this.assetDao.getPublicAssets()
    this.setState({
      treeData: toTreeData(assets.data)
    })
  }

  getLayoutAttrs () {
    const layoutAttrs = []
    if (this.state.showPanel) {
      layoutAttrs.push('prop-panel')
    }
    return layoutAttrs
  }

  render () {
    const { windowWidth, windowHeight, navWidth, panelWidth, showPanel, toolbarShow, treeData } = this.state

    // 切换全屏的操作
    const { fullScreen } = toolbarShow
    let workspaceWidth = 0
    if (fullScreen) {
      workspaceWidth = windowWidth
    } else if (showPanel) {
      workspaceWidth = windowWidth - navWidth - 20 - panelWidth
    } else {
      workspaceWidth = windowWidth - navWidth - 20
    }

    // 拖拽左侧导航及右侧面板的响应事件
    const handleDrag = (e, data) => {
      this.setState({
        navWidth: this.state.navWidth + data.deltaX
      })
    }
    const handlePanelDrag = (e, data) => {
      this.setState({
        panelWidth: this.state.panelWidth - data.deltaX
      })
    }

    // 左侧导航菜单切换事件
    const onLeftNavMenuCommand = (cmd) => {
      switch (cmd) {
        case 'toggle-panel':
          this.setState({
            showPanel: !this.state.showPanel
          })
      }
    }

    // 关闭面板处理
    const closePanel = () => {
      this.setState({
        showPanel: false
      })
    }

    // Toolbar show切换事件
    const onToolbarShowChange = (show) => {
      this.setState({
        toolbarShow: Object.assign(toolbarShow, show)
      })
    }

    const mainStyle = {
      left: (navWidth + 10) + 'px',
      top: '10px',
      bottom: '10px',
      right: '10px',
      borderRadius: '4px'
    }
    if (fullScreen) {
      mainStyle.left = 0
      mainStyle.top = 0
      mainStyle.bottom = 0
      mainStyle.borderRadius = 0
      mainStyle.right = 0
    }

    return (
      <div id='editor'>
        <div className='main-content'>
          {!fullScreen &&
            <Draggable
              axis='x'
              defaultClassName='nav-drag'
              defaultClassNameDragging='nav-dragging'
              bounds={{ left: 200 }}
              defaultPosition={{ x: this.state.navWidth, y: 0 }}
              onDrag={handleDrag}
            >
              <div />
            </Draggable>}

          {showPanel && !fullScreen &&
            <Draggable
              axis='x'
              defaultClassName='panel-drag'
              defaultClassNameDragging='nav-dragging'
              defaultPosition={{ x: workspaceWidth + this.state.navWidth, y: 0 }}
              onDrag={handlePanelDrag}
            >
              <div />
            </Draggable>}

          {!fullScreen &&
            <div
              className='nav-wrapper' style={{
                width: this.state.navWidth + 'px'
              }}
            >
              <div className='nav-content'>
                <NavLeft treeData={treeData} checked={this.getLayoutAttrs()} onCommand={onLeftNavMenuCommand} />
              </div>
            </div>}

          <div
            className='main' style={mainStyle}
          >
            <div
              className='workspace' style={{
                width: workspaceWidth + 'px'
              }}
            >
              <Toolbar shows={toolbarShow} onShowChange={onToolbarShowChange} />
              <WorkSpace zoom={1} rootElements={[]} width={workspaceWidth} height={fullScreen ? (windowHeight - 40) : (windowHeight - 60)} />
            </div>
            {showPanel && !fullScreen &&
              <div
                className='panel' style={{
                  left: showPanel ? (workspaceWidth + 'px') : 0
                }}
              >
                <HighlightOffIcon onClick={closePanel} size='small' color='primary' style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '10px' }} />
              </div>}
          </div>
        </div>
      </div>
    )
  }
}
