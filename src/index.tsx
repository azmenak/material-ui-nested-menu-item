import React, {useState, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Menu, {MenuProps} from '@material-ui/core/Menu'
import MenuItem, {MenuItemProps} from '@material-ui/core/MenuItem'
import ArrowRight from '@material-ui/icons/ArrowRight'

interface NestedMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
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
  MenuItemProps?: MenuItemProps
  MenuProps?: Omit<MenuProps, 'children'>
}

const useMenuItemStyles = makeStyles((theme) => ({
  root: (props: any) => ({
    backgroundColor: props.open
      ? theme.palette.action.hover
      : theme.palette.background.default
  })
}))

const NestedMenuItem = React.forwardRef<HTMLDivElement, NestedMenuItemProps>(
  function NestedMenuItem(props, ref) {
    const {
      parentMenuOpen,
      component = 'div',
      label,
      rightIcon = <ArrowRight />,
      children,
      MenuItemProps = {},
      MenuProps = {},
      onMouseEnter: onMouseEnterProp,
      onMouseLeave: onMouseLeaveProp,
      ...other
    } = props

    const menuItemRef = useRef<HTMLLIElement>(null)

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

    const handleMouseEnter = (event: React.MouseEvent) => {
      event.stopPropagation()
      setIsSubMenuOpen(true)
    }
    const handleMouseLeave = (event: React.MouseEvent) => {
      event.stopPropagation()
      setIsSubMenuOpen(false)
    }

    const open = isSubMenuOpen && parentMenuOpen

    const menuItemClasses = useMenuItemStyles({open})

    return (
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...other}
      >
        <MenuItem
          {...MenuItemProps}
          classes={menuItemClasses}
          ref={menuItemRef}
        >
          {label}
          {MenuItemProps.children}
          {rightIcon}
        </MenuItem>
        <Menu
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
  }
)

export default NestedMenuItem
