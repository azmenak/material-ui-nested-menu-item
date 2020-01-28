import React, {useState, useRef} from 'react'
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

    const onMouseEnter = (event: React.MouseEvent) => {
      event.stopPropagation()
      setIsSubMenuOpen(true)
    }
    const onMouseLeave = (event: React.MouseEvent) => {
      event.stopPropagation()
      setIsSubMenuOpen(false)
    }

    return (
      <div
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...other}
      >
        <MenuItem {...MenuItemProps} ref={menuItemRef}>
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
          open={isSubMenuOpen && parentMenuOpen}
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
