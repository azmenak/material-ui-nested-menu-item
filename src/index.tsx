import React, {useState, useRef, useImperativeHandle} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Menu, {MenuProps} from '@material-ui/core/Menu'
import MenuItem, {MenuItemProps} from '@material-ui/core/MenuItem'
import ArrowRight from '@material-ui/icons/ArrowRight'
import clsx from 'clsx'

export interface NestedMenuItemProps extends Omit<MenuItemProps, 'button'> {
  /**
   * Open state of parent `<Menu />`, used to close decendent menus when the
   * root menu is closed.
   */
  parentMenuOpen: boolean
  /**
   * Component for the container element.
   * @default 'div'
   */
  component?: React.ElementType
  /**
   * Effectively becomes the `children` prop passed to the `<MenuItem/>`
   * element.
   */
  label?: React.ReactNode
  /**
   * @default <ArrowRight />
   */
  rightIcon?: React.ReactNode
  /**
   * Props passed to container element.
   */
  ContainerProps?: React.HTMLAttributes<Element>
  /**
   * Props passed to sub `<Menu/>` element
   */
  MenuProps?: Omit<MenuProps, 'children'>
  /**
   * @see https://material-ui.com/api/list-item/
   */
  button?: true | undefined
}

const useMenuItemStyles = makeStyles((theme) => ({
  root: (props: any) => ({
    backgroundColor: props.open
      ? theme.palette.action.hover
      : theme.palette.background.default
  })
}))

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
    className,
    MenuProps = {},
    ContainerProps,
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
      {...ContainerProps}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuItem
        {...MenuItemProps}
        className={clsx(menuItemClasses.root, className)}
        ref={menuItemRef}
      >
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
