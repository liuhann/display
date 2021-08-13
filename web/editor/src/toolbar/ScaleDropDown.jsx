import React from 'react'
import AddBoxIcon from '@material-ui/icons/AddBox'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const getScale = scale => {
  return Math.floor(scale * 100) + '%'
}

export default ({
  scale,
  classes,
  changeShow
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const fixScaleTo = scale => {
    setAnchorEl(null)
    changeShow('scale', scale)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <span>
      <IconButton
        classes={{
          root: classes.iconbutton
        }} aria-label='放大' onClick={() => {
          let toScale = scale - 0.1
          if (toScale < 0.1) {
            toScale = 0.1
          }
          changeShow('scale', toScale)
        }}
      >
        <IndeterminateCheckBoxIcon fontSize='small' />
      </IconButton>
      <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
        {getScale(scale)}
      </Button>
      <IconButton
        classes={{
          root: classes.iconbutton
        }} aria-label='放大' onClick={() => changeShow('scale', scale + 0.1)}
      >
        <AddBoxIcon fontSize='small' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem onClick={handleClose}>适应窗口</MenuItem>
        <MenuItem onClick={() => fixScaleTo(0.3)}>30%</MenuItem>
        <MenuItem onClick={() => fixScaleTo(0.5)}>50%</MenuItem>
        <MenuItem onClick={() => fixScaleTo(0.7)}>70%</MenuItem>
        <MenuItem onClick={() => fixScaleTo(1)}>100%</MenuItem>
        <MenuItem onClick={() => fixScaleTo(1.2)}>120%</MenuItem>
        <MenuItem onClick={() => fixScaleTo(2)}>200%</MenuItem>
        <MenuItem onClick={() => fixScaleTo(3)}>300%</MenuItem>
      </Menu>
    </span>
  )
}
