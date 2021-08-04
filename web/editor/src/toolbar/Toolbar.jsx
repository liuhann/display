import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined'
import FullscreenExitSharpIcon from '@material-ui/icons/FullscreenExitSharp';
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { green, grey } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    // width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    height: '40px',
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
    // '& svg': {
    //   margin: theme.spacing(1.5)
    // },
    // '& hr': {
    //   margin: theme.spacing(0, 0.5)
    // }
  },
  iconbutton: {
    padding: '7px',
    '& .MuiSvgIcon-fontSizeSmall': {
      fontSize: '20px'
    }
  }
}))

export default ({
  shows = {
    fullScreen: false,
    locked: false
  },
  onShowChange = () => {}
}) => {
  const classes = useStyles()

  const changeShow = (key, value) => {
    onShowChange({
      [key]: value
    })
  }

  const RightIcons = () => {
    return (
      <Grid item>
        {!shows.fullScreen &&
          <IconButton aria-label='全屏' color='action' className={classes.iconbutton} onClick={() => changeShow('fullScreen', true)}>
            <FullscreenIcon fontSize='small' />
          </IconButton>}
        {shows.fullScreen &&
          <IconButton aria-label='退出全屏' color='action' className={classes.iconbutton} onClick={() => changeShow('fullScreen', false)}>
            <FullscreenExitIcon fontSize='small' />
          </IconButton>}
        <IconButton
          aria-label='打开预览' color='action' className={classes.iconbutton} onClick={() => changeShow('command', {
            openLink: true
          })}
        >
          <OpenInNewOutlinedIcon fontSize='small' />
        </IconButton>
      </Grid>
    )
  }

  const LeftIcons = () => {
    return (
      <Grid item xs>
        {!shows.locked &&
          <Tooltip title='锁定' arrow>
            <IconButton aria-label='锁定' className={classes.iconbutton}>
              <LockOpenIcon fontSize='small' />
            </IconButton>
          </Tooltip>}
        {shows.locked &&
          <Tooltip title='解除锁定' arrow>
            <IconButton aria-label='解除锁定' className={classes.iconbutton}>
              <LockIcon size='small' fontSize='small' />
            </IconButton>
          </Tooltip>}
        <Tooltip title='删除' arrow>
          <IconButton aria-label='删除' className={classes.iconbutton}>
            <DeleteOutlineIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Grid>
    )
  }

  return (
    <Grid container alignItems='center' className={classes.root}>
      <LeftIcons />
      <RightIcons />
    </Grid>
  )
}
