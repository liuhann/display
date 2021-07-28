import SidebarHeader from './SidebarHeader.jsx'
import Nav from './nav.jsx'
import FcSearch from './FcSearch.jsx'
import ComponentTree from './ComponentTree.jsx'

export default {
  title: 'LeftSide'
}

export const Header = SidebarHeader.bind({})
Header.args = {}

export const NavTest = Nav.bind({})
NavTest.args = {}

export const Search = FcSearch.bind({})
Search.args = {}

export const Tree = ComponentTree.bind({})
Tree.args = {}
