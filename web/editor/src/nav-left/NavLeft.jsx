import React, { useState } from 'react'
import SidebarHeader from './SidebarHeader.jsx'
import FcSearch from './FcSearch.jsx'
import ComponentTree from './ComponentTree.jsx'

export default ({
  treeData
}) => {
  const [searchValue, setSearchValue] = useState('')

  const onSearchValueChange = value => {
    setSearchValue(value)
  }

  return (
    <div className='nav-left'>
      <SidebarHeader />
      <FcSearch onInput={onSearchValueChange} />
      <ComponentTree
        treeData={treeData} filter={{
          name: searchValue
        }}
      />
    </div>
  )
}
