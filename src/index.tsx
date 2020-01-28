import React, {useState, useRef, useImperativeHandle} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Menu, {MenuProps} from '@material-ui/core/Menu'
import MenuItem, {MenuItemProps} from '@material-ui/core/MenuItem'
import ArrowRight from '@material-ui/icons/ArrowRight'

export interface NestedMenuItemProps extends MenuItemProps {
  parentMenuOpen: boolean
  /**
   * @default 'div'
   */
  component?: React.ElementType
  label?: React.ReactNode
  /**
   * @default <ArrowRight />
   */
  rightIcon?: React.ReactNode
  ContainerProps?: React.HTMLAttributes<Element>
  MenuProps?: Omit<MenuProps, 'children'>
}

const useMenuItemStyles = makeStyles((theme) => ({
  root: (props: any) => ({
    backgroundColor: props.open
      ? theme.palette.action.hover
      : theme.palette.background.default
  })
}))

// TODO
// Generic for ContainerProps from `component`

const NestedMenuItem = React.forwardRef<
  HTMLLIElement | null,
  NestedMenuItemProps
>(function NestedMenuItem(props, ref) {
  const {
    parentMenuOpen,
    component = 'div',
    label,
    rightIcon = <ArrowRight />,
    children,
    MenuProps = {},
    ContainerProps,
    onMouseEnter: onMouseEnterProp,
    onMouseLeave: onMouseLeaveProp,
    ...MenuItemProps
  } = props

  const menuItemRef = useRef<HTMLLIElement>(null)
  useImperativeHandle(ref, () => menuItemRef.current)

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (ContainerProps?.onMouseEnter) {
      ContainerProps.onMouseEnter(event)
    }
    setIsSubMenuOpen(true)
  }
  const handleMouseLeave = (event: React.MouseEvent) => {
    if (ContainerProps?.onMouseLeave) {
      ContainerProps.onMouseLeave(event)
    }
    setIsSubMenuOpen(false)
  }

  const open = isSubMenuOpen && parentMenuOpen

  const menuItemClasses = useMenuItemStyles({open})

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...ContainerProps}
    >
      <MenuItem {...MenuItemProps} classes={menuItemClasses} ref={menuItemRef}>
        {label}
        {rightIcon}
      </MenuItem>
      <Menu
        // Set pointer events to 'none' to prevent the invisible Popover div
        // from capturing events for clicks and hovers
        style={{pointerEvents: 'none'}}
        anchorEl={menuItemRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={open}
        onClose={() => {
          setIsSubMenuOpen(false)
        }}
      >
        <div style={{pointerEvents: 'auto'}}>{children}</div>
      </Menu>
    </div>
  )
})

export default NestedMenuItem
