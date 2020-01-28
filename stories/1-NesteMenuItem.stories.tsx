import React, {useState} from 'react'
import {Menu, MenuItem} from '@material-ui/core'

import NestedMenuItem from '../src'

export default {
  title: 'Nested Menu Item'
}

export const NestedMenu = () => {
  const [menuPosition, setMenuPosition] = useState<any>(null)

  const handleRightClick = (event: React.MouseEvent) => {
    if (menuPosition) {
      return
    }
    event.preventDefault()
    setMenuPosition({
      top: event.pageX,
      left: event.pageY
    })
  }

  return (
    <div onContextMenu={handleRightClick}>
      Right click to open menu
      <Menu
        open={!!menuPosition}
        onClose={() => setMenuPosition(null)}
        anchorReference='anchorPosition'
        anchorPosition={menuPosition}
      >
        <MenuItem>Button 1</MenuItem>
        <MenuItem>Button 2</MenuItem>
        <NestedMenuItem label='Button 3' parentMenuOpen={!!menuPosition}>
          <MenuItem>Sub-Button 1</MenuItem>
          <MenuItem>Sub-Button 2</MenuItem>
        </NestedMenuItem>
      </Menu>
    </div>
  )
}
