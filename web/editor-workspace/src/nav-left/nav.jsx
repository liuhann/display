import React from 'react'
import './style.css'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

export default ({
  value = 0,
  tabs = [{
    label: 'Tab1',
    id: 'tab1'
  }, {
    label: 'Tab2',
    id: 'tab2'
  }],
  change
}) => {
  const handleChange = (val) => {
  }

  return (
    <Tabs
      orientation='vertical'
      variant='scrollable'
      value={value}
      onChange={handleChange}
      aria-label='Vertical tabs example'
      className='any'
    >
      {tabs.map((tab, index) =>
        <Tab
          style={{
            width: '66px',
            minWidth: 'unset'
          }}
          icon={<img width={32} height={32} src='http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg' />}
          label={tab.label}
          key={tab.id}
          id={index}
        />)}
    </Tabs>
  )
}
