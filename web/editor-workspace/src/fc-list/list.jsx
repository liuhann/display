import React from 'react'
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import IconButton from '@material-ui/core/IconButton'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  imageList: {
    width: 360,
    height: 450,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)'
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  icon: {
    color: 'white'
  }
}))

export default ({
  itemData = [{
    title: '你好',
    img: 'http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg'
  }, {
    title: '你好',
    img: 'http://10.10.247.1:4873/-/static/93df1ce974e744e7d98f5d842da74ba0.svg'
  }]
}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <ImageList rowHeight={130} gap={5} cols={3} className={classes.imageList}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} cols={1} rows={1}>
            <img src={item.img} alt={item.title} />
            <ImageListItemBar
              title={item.title}
              position='top'
              actionIcon={
                <IconButton aria-label={`star ${item.title}`} className={classes.icon}>
                  <StarBorderIcon />
                </IconButton>
              }
              actionPosition='left'
              className={classes.titleBar}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  )
}
