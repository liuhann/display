import React, { useState } from 'react'
import ComponentTree from './ComponentTree.jsx'
import Popover from '@material-ui/core/Popover'
import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

export default ({
  treeData
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (ref) => {
    setAnchorEl(ref.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <ComponentTree treeData={treeData} handlePopoverOpen={handlePopoverOpen} handlePopoverClose={handlePopoverClose} />
      <Popper
        open={open} anchorEl={anchorEl} placement='right' transition popperOptions={{
          offset: {
            offset: '10%'
          }
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography>The content of the Popper.</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  )
}
