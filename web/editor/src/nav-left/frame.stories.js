import SidebarHeader from './SidebarHeader.jsx'
import FcSearch from './FcSearch.jsx'
import ComponentTree from './ComponentTree.jsx'
import NavLeft from './NavLeft.jsx'
import treeData from '../treeData'

export default {
  title: 'NavLeft',
  component: NavLeft
}

export const Nav = NavLeft.bind({})
Nav.args = {
  treeData
}

export const Header = SidebarHeader.bind({})
Header.args = {
  checked: ['prop-panel']
}

export const Search = FcSearch.bind({})
Search.args = {}

export const Tree = ComponentTree.bind({})
Tree.args = {
  onTreeNodeHover: (e) => {
    console.log(e)
  },
  onTreeNodeOut: (e) => {
    console.log(e)
  },
  treeData
}
