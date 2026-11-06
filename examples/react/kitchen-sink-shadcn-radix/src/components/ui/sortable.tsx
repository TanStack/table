'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
import {
  RestrictToHorizontalAxis,
  RestrictToVerticalAxis,
} from '@dnd-kit/abstract/modifiers'
import { closestCorners } from '@dnd-kit/collision'
import { Slot } from 'radix-ui'

import { useComposedRefs } from '@/lib/composition'
import { cn } from '@/lib/utils'

type UniqueIdentifier = string | number
type DragDropProviderProps = React.ComponentProps<typeof DragDropProvider>
type DragEndEvent = Parameters<
  NonNullable<DragDropProviderProps['onDragEnd']>
>[0]

interface OrientationConfig {
  modifiers: NonNullable<DragDropProviderProps['modifiers']>
  collisionDetector?: typeof closestCorners
}

const orientationConfig: Record<
  'vertical' | 'horizontal' | 'mixed',
  OrientationConfig
> = {
  vertical: {
    modifiers: [RestrictToVerticalAxis],
  },
  horizontal: {
    modifiers: [RestrictToHorizontalAxis],
  },
  mixed: {
    modifiers: [],
    collisionDetector: closestCorners,
  },
}

const ROOT_NAME = 'Sortable'
const CONTENT_NAME = 'SortableContent'
const ITEM_NAME = 'SortableItem'
const ITEM_HANDLE_NAME = 'SortableItemHandle'
const OVERLAY_NAME = 'SortableOverlay'

const SORTABLE_ERROR = {
  [ROOT_NAME]: `\`${ROOT_NAME}\` components must be within \`${ROOT_NAME}\``,
  [CONTENT_NAME]: `\`${CONTENT_NAME}\` must be within \`${ROOT_NAME}\``,
  [ITEM_NAME]: `\`${ITEM_NAME}\` must be within \`${CONTENT_NAME}\``,
  [ITEM_HANDLE_NAME]: `\`${ITEM_HANDLE_NAME}\` must be within \`${ITEM_NAME}\``,
  [OVERLAY_NAME]: `\`${OVERLAY_NAME}\` must be within \`${ROOT_NAME}\``,
} as const

interface SortableRootContextValue<T> {
  id: string
  items: Array<UniqueIdentifier>
  collisionDetector: OrientationConfig['collisionDetector']
  getItemValue: (item: T) => UniqueIdentifier
  flatCursor: boolean
}

const SortableRootContext =
  React.createContext<SortableRootContextValue<unknown> | null>(null)
SortableRootContext.displayName = ROOT_NAME

function useSortableContext(name: keyof typeof SORTABLE_ERROR) {
  const context = React.useContext(SortableRootContext)
  if (!context) {
    throw new Error(SORTABLE_ERROR[name])
  }
  return context
}

interface GetItemValue<T> {
  /**
   * Callback that returns a unique identifier for each sortable item. Required for array of objects.
   * @example getItemValue={(item) => item.id}
   */
  getItemValue: (item: T) => UniqueIdentifier
}

type SortableProps<T> = DragDropProviderProps & {
  id?: string
  value: Array<T>
  onValueChange?: (items: Array<T>) => void
  onMove?: (
    event: DragEndEvent & { activeIndex: number; overIndex: number },
  ) => void
  orientation?: 'vertical' | 'horizontal' | 'mixed'
  flatCursor?: boolean
} & (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>)

function Sortable<T>(props: SortableProps<T>) {
  const {
    id = React.useId(),
    value,
    onValueChange,
    modifiers,
    onMove,
    orientation = 'vertical',
    flatCursor = false,
    getItemValue: getItemValueProp,
    ...sortableProps
  } = props
  const config = React.useMemo(
    () => orientationConfig[orientation],
    [orientation],
  )
  const getItemValue = React.useCallback(
    (item: T): UniqueIdentifier => {
      if (typeof item === 'object' && !getItemValueProp) {
        throw new Error('getItemValue is required when using array of objects.')
      }
      return getItemValueProp
        ? getItemValueProp(item)
        : (item as UniqueIdentifier)
    },
    [getItemValueProp],
  )

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      if (event.canceled) return // dropped with Escape, so do nothing
      const { source } = event.operation
      if (!isSortable(source)) return

      const { initialIndex: activeIndex, index: overIndex } = source.sortable
      if (activeIndex === overIndex) return

      if (onMove) {
        onMove({ ...event, activeIndex, overIndex })
      } else {
        const next = [...value]
        const [moved] = next.splice(activeIndex, 1)
        next.splice(overIndex, 0, moved as T)
        onValueChange?.(next)
      }
    },
    [value, onValueChange, onMove],
  )

  const items = React.useMemo(() => {
    return value.map((item) => getItemValue(item))
  }, [value, getItemValue])

  const contextValue = React.useMemo(
    () => ({
      id,
      items,
      collisionDetector: config.collisionDetector,
      getItemValue,
      flatCursor,
    }),
    [id, items, config.collisionDetector, getItemValue, flatCursor],
  )

  return (
    <SortableRootContext.Provider
      value={contextValue as SortableRootContextValue<unknown>}
    >
      <DragDropProvider
        {...sortableProps}
        modifiers={modifiers ?? config.modifiers}
        onDragEnd={(event, manager) => {
          sortableProps.onDragEnd?.(event, manager) // the caller's handler runs first
          onDragEnd(event)
        }}
      />
    </SortableRootContext.Provider>
  )
}

const SortableContentContext = React.createContext<boolean>(false)
SortableContentContext.displayName = CONTENT_NAME

interface SortableContentProps extends React.ComponentProps<'div'> {
  children: React.ReactNode
  asChild?: boolean
  withoutSlot?: boolean
}

function SortableContent({
  ref,
  asChild,
  withoutSlot,
  children,
  ...contentProps
}: SortableContentProps) {
  useSortableContext(CONTENT_NAME)

  const ContentSlot = asChild ? Slot.Root : 'div'

  return (
    <SortableContentContext.Provider value={true}>
      {withoutSlot ? (
        children
      ) : (
        <ContentSlot data-slot="sortable-content" {...contentProps} ref={ref}>
          {children}
        </ContentSlot>
      )}
    </SortableContentContext.Provider>
  )
}

interface SortableItemContextValue {
  id: string
  setHandleRef: (node: Element | null) => void
  isDragging?: boolean
  disabled?: boolean
}

const SortableItemContext =
  React.createContext<SortableItemContextValue | null>(null)
SortableItemContext.displayName = ITEM_NAME

interface SortableItemProps extends React.ComponentProps<'div'> {
  value: UniqueIdentifier
  asHandle?: boolean
  asChild?: boolean
  disabled?: boolean
}

function SortableItem({
  ref,
  value,
  style,
  asHandle,
  asChild,
  disabled,
  className,
  ...itemProps
}: SortableItemProps) {
  const inSortableContent = React.useContext(SortableContentContext)
  const inSortableOverlay = React.useContext(SortableOverlayContext)

  if (!inSortableContent && !inSortableOverlay) {
    throw new Error(SORTABLE_ERROR[ITEM_NAME])
  }

  if (value === '') {
    throw new Error(`\`${ITEM_NAME}\` value cannot be an empty string`)
  }

  const context = useSortableContext(ITEM_NAME)
  const id = React.useId()
  const {
    ref: sortableRef,
    handleRef,
    isDragging,
  } = useSortable({
    id: value,
    index: context.items.indexOf(value),
    disabled,
    collisionDetector: context.collisionDetector,
  })

  const composedRef = useComposedRefs(ref, (node) => {
    if (disabled) return
    sortableRef(node)
  })

  const itemContext = React.useMemo<SortableItemContextValue>(
    () => ({
      id,
      setHandleRef: handleRef,
      isDragging,
      disabled,
    }),
    [id, handleRef, isDragging, disabled],
  )

  const ItemSlot = asChild ? Slot.Root : 'div'

  return (
    <SortableItemContext.Provider value={itemContext}>
      <ItemSlot
        data-slot="sortable-item"
        id={id}
        data-dragging={isDragging ? '' : undefined}
        {...itemProps}
        tabIndex={disabled ? undefined : 0}
        ref={composedRef}
        style={style}
        className={cn(
          'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
          {
            'touch-none select-none': asHandle,
            'cursor-default': context.flatCursor,
            'data-dragging:cursor-grabbing': !context.flatCursor,
            'cursor-grab': !isDragging && asHandle && !context.flatCursor,
            'opacity-50': isDragging,
            'pointer-events-none opacity-50': disabled,
          },
          className,
        )}
      />
    </SortableItemContext.Provider>
  )
}

interface SortableItemHandleProps extends React.ComponentProps<'button'> {
  asChild?: boolean
}

function SortableItemHandle({
  ref,
  asChild,
  disabled,
  className,
  ...itemHandleProps
}: SortableItemHandleProps) {
  const itemContext = React.useContext(SortableItemContext)
  if (!itemContext) {
    throw new Error(SORTABLE_ERROR[ITEM_HANDLE_NAME])
  }
  const context = useSortableContext(ITEM_HANDLE_NAME)

  const isDisabled = disabled ?? itemContext.disabled

  const composedRef = useComposedRefs(ref, (node) => {
    if (isDisabled) return
    itemContext.setHandleRef(node)
  })

  const HandleSlot = asChild ? Slot.Root : 'button'

  return (
    <HandleSlot
      data-slot="sortable-item-handle"
      type="button"
      aria-controls={itemContext.id}
      data-dragging={itemContext.isDragging ? '' : undefined}
      {...itemHandleProps}
      ref={composedRef}
      className={cn(
        'select-none disabled:pointer-events-none disabled:opacity-50',
        context.flatCursor
          ? 'cursor-default'
          : 'cursor-grab data-dragging:cursor-grabbing',
        className,
      )}
      disabled={isDisabled}
    />
  )
}

const SortableOverlayContext = React.createContext(false)
SortableOverlayContext.displayName = OVERLAY_NAME

interface SortableOverlayProps extends Omit<
  React.ComponentProps<typeof DragOverlay>,
  'children'
> {
  container?: HTMLElement | DocumentFragment | null
  children?:
    ((params: { value: UniqueIdentifier }) => React.ReactNode) | React.ReactNode
}

function SortableOverlay(props: SortableOverlayProps) {
  const { container: containerProp, children, ...overlayProps } = props
  const context = useSortableContext(OVERLAY_NAME)

  const [mounted, setMounted] = React.useState(false)
  React.useLayoutEffect(() => setMounted(true), [])

  const container = containerProp ?? (mounted ? globalThis.document.body : null)

  if (!container) return null

  return ReactDOM.createPortal(
    <DragOverlay
      className={cn(!context.flatCursor && 'cursor-grabbing')}
      {...overlayProps}
    >
      {(source) => (
        <SortableOverlayContext.Provider value={true}>
          {typeof children === 'function'
            ? children({ value: source.id })
            : children}
        </SortableOverlayContext.Provider>
      )}
    </DragOverlay>,
    container,
  )
}

const Root = Sortable
const Content = SortableContent
const Item = SortableItem
const ItemHandle = SortableItemHandle
const Overlay = SortableOverlay

export {
  Content,
  Item,
  ItemHandle,
  Overlay,
  //
  Root,
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
}