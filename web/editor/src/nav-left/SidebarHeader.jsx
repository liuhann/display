import React from 'react'
import './style.css'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import MenuItem from '@material-ui/core/MenuItem'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import CheckIcon from '@material-ui/icons/Check'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import BrokenImageIcon from '@material-ui/icons/BrokenImage'
import { makeStyles, withStyles } from '@material-ui/core/styles'

import { green, grey } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0.5)
  },
  smallFont: {
    fontSize: '12px',
    color: '#666',
    '& .MuiTypography-root': {
      fontSize: '14px'
    }
  },
  headerIcon: {
    float: 'right',
    boxShadow: 'rgb(51 51 51 / 20%) 0px 0px 0px 1px inset'
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}))

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    filter: 'drop-shadow(rgba(0, 0, 0, 0.05) 0px 5px 5px) drop-shadow(rgba(0, 0, 0, 0.1) 0px 1px 3px)'
  }
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&': {
      padding: theme.spacing(1),
      height: '36px'
    }
  }
}))(MenuItem)

const TitleMenu = ({
  anchorEl,
  handleClose
}) => {
  const classes = useStyles()
  return (
    <StyledMenu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <StyledMenuItem>
        <SaveIcon
          style={{
            marginRight: '5px'
          }} fontSize='small'
        />
        <ListItemText
          className={classes.smallFont}
          primary='保存'
        />
        <ListItemIcon style={{
          alignItems: 'flex-end'
        }}
        >
          {/* <CheckIcon fontSize='small' /> */}
        </ListItemIcon>
      </StyledMenuItem>
      <StyledMenuItem divider>
        <ListItemText
          className={classes.smallFont}
          primary='另存为...'
        />
        <ListItemIcon style={{
          alignItems: 'flex-end'
        }}
        >
          {/* <CheckIcon fontSize='small' /> */}
        </ListItemIcon>
      </StyledMenuItem>
      <StyledMenuItem>
        <MenuOpenIcon
          style={{
            marginRight: '5px'
          }} fontSize='small'
        />
        <ListItemText className={classes.smallFont} primary='显示配置面板' />
        <ListItemIcon
          style={{
            flexDirection: 'row-reverse'
          }}
        >
          <CheckIcon fontSize='small' />
        </ListItemIcon>
      </StyledMenuItem>
    </StyledMenu>
  )
}

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
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div className='sidebar-header' style={{ padding: '10px' }}>
      <Button
        className={classes.button}
        style={{ padding: '2px', fontWeight: 600, color: grey[900] }}
        startIcon={<BrokenImageIcon size='large' fontSize='large' style={{ color: green[500], fontSize: '28px' }} />}
      >
        DISPLAY
      </Button>
      <IconButton aria-label='delete' size='small' variant='outlined' className={classes.headerIcon} onClick={handleClick}>
        <MoreHorizIcon fontSize='inherit' className={classes.margin} />
      </IconButton>
      <TitleMenu anchorEl={anchorEl} handleClose={handleClose} />
    </div>
  )
}
