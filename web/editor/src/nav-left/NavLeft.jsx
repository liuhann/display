import React, { useState } from 'react'
import SidebarHeader from './SidebarHeader.jsx'
import FcSearch from './FcSearch.jsx'
import ComponentTree from './ComponentTree.jsx'

export default ({
  checked,
  onCommand,
  treeData
}) => {
  const [searchValue, setSearchValue] = useState('')

  const onSearchValueChange = value => {
    setSearchValue(value)
  }

  return (
    <div className='nav-left'>
      <SidebarHeader checked={checked} onCommand={onCommand} />
      <FcSearch onInput={onSearchValueChange} />
      <ComponentTree
        treeData={treeData} filter={{
          name: searchValue
        }}
      />
    </div>
  )
}
