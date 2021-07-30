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
import StorefrontIcon from '@material-ui/icons/Storefront'
import CancelIcon from '@material-ui/icons/Cancel'

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(2),
    padding: '0 10px',
    boxSizing: 'border-box',
    width: '100%'
  },
  help: {
    '&': {
      fontSize: '14px'
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
    onInput && onInput('')
  }

  const CancelButton = (
    <InputAdornment position='end'>
      {searchValue &&
        <IconButton
          aria-label='toggle password visibility'
          style={{ padding: '6px', fontWeight: 600 }}
          onClick={clearValue}
        >
          <CancelIcon style={{ fontSize: '16px' }} />
        </IconButton>}
      <IconButton
        aria-label='toggle password visibility'
        color='primary'
        style={{ padding: '6px', fontWeight: 600 }}
        onClick={clearValue}
      >
        <StorefrontIcon style={{ fontSize: '20px' }} />
      </IconButton>
    </InputAdornment>
  )

  return (
    <FormControl className={classes.margin}>
      <Input
        className={classes.help}
        placeholder='按名称查找组件' fullWidth value={searchValue} endAdornment={CancelButton} inputProps={{ 'aria-label': 'description' }} onChange={
          event => {
            const value = event.target.value
            setSearchValue(value)
            onInput && onInput(value)
          }
        }
      />
    </FormControl>
  )
}
