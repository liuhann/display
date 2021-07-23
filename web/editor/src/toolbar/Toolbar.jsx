import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
const useStyles = makeStyles((theme) => ({
  root: {
    // width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
    // '& svg': {
    //   margin: theme.spacing(1.5)
    // },
    // '& hr': {
    //   margin: theme.spacing(0, 0.5)
    // }
  }
}))

export default ({
  locked
}) => {
  const classes = useStyles()

  return (
    <Grid container alignItems='center' className={classes.root}>
      <Grid item xs>
        <FormatAlignLeftIcon />
        <FormatAlignCenterIcon />
        <FormatAlignRightIcon />
      </Grid>
      <Grid item alignItems='right'>
        {locked &&
          <Tooltip title='锁定' arrow>
            <IconButton aria-label='锁定' color='primary'>
              <LockOpenIcon />
            </IconButton>
          </Tooltip>}
        {!locked &&
          <Tooltip title='解除锁定' arrow>
            <IconButton aria-label='解除锁定' color='primary'>
              <LockIcon />
            </IconButton>
          </Tooltip>}
        <Tooltip title='删除' arrow>
          <IconButton aria-label='删除' color='primary'>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
