import React, {useState, useRef} from 'react'
import {Menu, MenuItem, Typography} from '@material-ui/core'

import NestedMenuItem from '..'

export default {
  title: 'Nested Menu Item'
}

export const NestedMenu = () => {
  const [menuPosition, setMenuPosition] = useState<any>({top: 10, left: 10})
  const menuItemRef = useRef<any>(null)

  const handleRightClick = (event: React.MouseEvent) => {
    if (menuPosition) {
      return
    }
    event.preventDefault()
    setMenuPosition({
      top: event.pageY,
      left: event.pageX
    })
  }

  const handleItemClick = (event: React.MouseEvent) => {
    setMenuPosition(null)
  }

  return (
    <div onContextMenu={handleRightClick}>
      <Typography>Right click to open menu</Typography>
      <Menu
        open={!!menuPosition}
        onClose={() => setMenuPosition(null)}
        anchorReference='anchorPosition'
        anchorPosition={menuPosition}
      >
        <MenuItem onClick={handleItemClick}>Button 1</MenuItem>
        <MenuItem onClick={handleItemClick}>Button 2</MenuItem>
        <NestedMenuItem
          ref={menuItemRef}
          label='Button 3'
          parentMenuOpen={!!menuPosition}
          onClick={handleItemClick}
        >
          <MenuItem onClick={handleItemClick}>Sub-Button 1</MenuItem>
          <MenuItem onClick={handleItemClick}>Sub-Button 2</MenuItem>
          <NestedMenuItem
            label='Sub-Button 3'
            parentMenuOpen={!!menuPosition}
            onClick={handleItemClick}
          >
            <MenuItem onClick={handleItemClick}>Sub-Sub-Button 1</MenuItem>
            <MenuItem onClick={handleItemClick}>Sub-Sub-Button 2</MenuItem>
          </NestedMenuItem>
        </NestedMenuItem>
        <MenuItem onClick={handleItemClick}>Button 4</MenuItem>
      </Menu>
    </div>
  )
}
