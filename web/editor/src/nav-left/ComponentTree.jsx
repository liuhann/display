import React, { useState, useRef } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import Typography from '@material-ui/core/Typography'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Avatar from '@material-ui/core/Avatar'
import Collapse from '@material-ui/core/Collapse'
import Label from '@material-ui/icons/Label'

const useTreeItemStyles = makeStyles((theme) => ({
  content: {
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit'
  },
  iconContainer: {
    width: '0px'
  },
  labelRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  labelFolderRoot: {
    padding: theme.spacing(0.5),
    alignItems: 'center',
    display: 'flex'
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: 'inherit',
    marginLeft: '10px',
    fontSize: theme.typography.caption
  },
  folderAvatar: {
    width: '16px',
    height: '16px'
  },
  itemAvatar: {
    margin: theme.spacing(1)
  },
  itemAvatarImg: {
    objectFit: 'contain'
  }
}))

function StyledTreeItem (props) {
  const classes = useTreeItemStyles()
  const { labelText, preview, isFolder, labelIcon: LabelIcon, labelInfo, color, bgColor, treeNodeHover, treeNodeOut, data, ...other } = props

  const dragStartHandler = (event, preview) => {
    // Create an image and then use it for the drag image.
    // NOTE: change "example.gif" to a real image URL or the image
    // will not be created and the default drag image will be used.
    const img = new window.Image()
    img.src = preview
    img.width = 100
    img.height = 100
    event.dataTransfer.setDragImage(img, 50, 50)
    event.dataTransfer.setData('text/plain', JSON.stringify(data))
    treeNodeOut && treeNodeOut()
  }
  return (
    <TreeItem
      draggable={!isFolder}
      onDragStart={(event) => !isFolder && dragStartHandler(event, preview)}
      onMouseEnter={(event) => treeNodeHover && treeNodeHover(event.currentTarget.getBoundingClientRect())}
      onMouseLeave={event => treeNodeOut && treeNodeOut()}
      label={
        <div className={isFolder ? classes.labelFolderRoot : classes.labelRoot}>
          {preview &&
            <Avatar
              alt={labelText} variant='rounded' src={preview} classes={{
                root: isFolder ? classes.folderAvatar : classes.itemAvatar,
                img: isFolder ? '' : classes.itemAvatarImg
              }}
            />}
          <Typography classes={{
            root: isFolder ? classes.labelText : ''
          }}
          >
            {labelText}
          </Typography>
        </div>
        }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor
      }}
      classes={{
        iconContainer: isFolder ? '' : classes.iconContainer,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label
      }}
      {...other}
    />
  )
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    '& .wrapperInner-x': {
      display: 'grid',
      'grid-template-columns': 'repeat(3, 33.33%)'
    }
  }
})

const filterTreeData = (treeData, filter) => {
  if (!filter || filter.name === '') {
    return treeData
  }
  const targetTree = []
  for (const pack of treeData) {
    if (pack.packageLabel.indexOf(filter.name) > -1) {
      targetTree.push(pack)
    } else {
      const componentsFiltered = []

      for (const component of pack.components) {
        if (component.label.indexOf(filter.name) > -1) {
          componentsFiltered.push(component)
        }
      }

      if (componentsFiltered.length) {
        const packFiltered = {}
        Object.assign(packFiltered, pack)
        packFiltered.components = componentsFiltered
        targetTree.push(packFiltered)
      }
    }
  }
  return targetTree
}

export default ({
  treeData,
  filter,
  onTreeNodeHover,
  onTreeNodeOut
}) => {
  const classes = useStyles()
  const RenderComponent = ({ data }) => {
    return (
      <StyledTreeItem
        treeNodeHover={onTreeNodeHover}
        treeNodeOut={onTreeNodeOut}
        preview={data.preview}
        nodeId={data.name}
        data={data}
        labelText={data.label}
      />
    )
  }

  const RenderPackage = ({ data, handlePopoverOpen, handlePopoverClose }) => {
    return (
      <StyledTreeItem nodeId={data.packageName} labelText={data.packageLabel} isFolder preview={data.preview}>
        <div className='wrapperInner-x' style={{ padding: '10px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 33.33%)' }}>
          {data.components.map((component, index) => <RenderComponent key={component.name} data={component} />)}
        </div>
      </StyledTreeItem>
    )
  }

  const filteredTreeData = filterTreeData(treeData, filter)

  return (
    <div>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
      >
        {filteredTreeData && filteredTreeData.map((data, index) => <RenderPackage data={data} key={data.packageName} />)}
      </TreeView>
    </div>
  )
}
