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
  ContainerProps?: React.HTMLAttributes<HTMLElement> &
    React.RefAttributes<HTMLElement | null>
  /**
   * Props passed to sub `<Menu/>` element
   */
  MenuProps?: Omit<MenuProps, 'children'>
  /**
   * @see https://material-ui.com/api/list-item/
   */
  button?: true | undefined
}

const TRANSPARENT = 'rgba(0,0,0,0)'
const useMenuItemStyles = makeStyles((theme) => ({
  root: (props: any) => ({
    backgroundColor: props.open ? theme.palette.action.hover : TRANSPARENT
  })
}))

/**
 * Use as a drop-in replacement for `<MenuItem>` when you need to add cascading
 * menu elements as children to this component.
 */
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
    tabIndex: tabIndexProp,
    MenuProps = {},
    ContainerProps: ContainerPropsProp = {},
    ...MenuItemProps
  } = props

  const {ref: containerRefProp, ...ContainerProps} = ContainerPropsProp

  const menuItemRef = useRef<HTMLLIElement>(null)
  useImperativeHandle(ref, () => menuItemRef.current)

  const containerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(containerRefProp, () => containerRef.current)

  const menuContainerRef = useRef<HTMLDivElement>(null)

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(true)

    if (ContainerProps?.onMouseEnter) {
      ContainerProps.onMouseEnter(event)
    }
  }
  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(false)

    if (ContainerProps?.onMouseLeave) {
      ContainerProps.onMouseLeave(event)
    }
  }

  // Check if any immediate children are active
  const isSubmenuFocused = () => {
    const active = containerRef.current?.ownerDocument?.activeElement
    for (const child of menuContainerRef.current?.children ?? []) {
      if (child === active) {
        return true
      }
    }
    return false
  }

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    if (event.target === containerRef.current) {
      setIsSubMenuOpen(true)
    }

    if (ContainerProps?.onFocus) {
      ContainerProps.onFocus(event)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      return
    }

    if (isSubmenuFocused()) {
      event.stopPropagation()
    }

    const active = containerRef.current?.ownerDocument?.activeElement

    if (event.key === 'ArrowLeft' && isSubmenuFocused()) {
      containerRef.current?.focus()
    }

    if (
      event.key === 'ArrowRight' &&
      event.target === containerRef.current &&
      event.target === active
    ) {
      const firstChild = menuContainerRef.current?.children[0] as
        | HTMLElement
        | undefined
      firstChild?.focus()
    }
  }

  const open = isSubMenuOpen && parentMenuOpen
  const menuItemClasses = useMenuItemStyles({open})

  // Root element must have a `tabIndex` attribute for keyboard navigation
  let tabIndex
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1
  }

  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
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
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false)
        }}
        {...MenuProps}
      >
        <div ref={menuContainerRef} style={{pointerEvents: 'auto'}}>
          {children}
        </div>
      </Menu>
    </div>
  )
})

export default NestedMenuItem
