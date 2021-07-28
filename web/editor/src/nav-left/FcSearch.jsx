import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import AccountCircle from '@material-ui/icons/AccountCircle'
import StoreIcon from '@material-ui/icons/Store'
import CancelIcon from '@material-ui/icons/Cancel'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  },
  help: {
    '& .MuiFormLabel-root': {
      fontSize: '12px'
    }
  }
}))

export default ({
  onInput,
  onSearch
}) => {
  const [searchValue, setSearchValue] = useState('')
  const classes = useStyles()

  const clearValue = () => {
    setSearchValue('')
  }

  const CancelButton = (
    <InputAdornment position='end'>
      <IconButton
        aria-label='toggle password visibility'
        style={{ padding: '6px', fontWeight: 600 }}
        onClick={clearValue}
      >
        <CancelIcon style={{ fontSize: '16px' }} />
      </IconButton>
    </InputAdornment>
  )

  const inputProps = {}
  if (searchValue) {
    inputProps.endAdornment = CancelButton
  }

  return (
    <FormControl className={classes.margin}>
      <TextField
        className={classes.help}
        label='按名称查找组件' size='small'
        value={searchValue}
        onChange={
          event => {
            const value = event.target.value
            setSearchValue(value)
          }
        }
        InputProps={inputProps}
      />
    </FormControl>
  )
}
