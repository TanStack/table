'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type {
  Announcements,
  DndContextProps,
  DragEndEvent,
  DraggableSyntheticListeners,
  DropAnimation,
  ScreenReaderInstructions,
  UniqueIdentifier,
} from '@dnd-kit/core'
import type { SortableContextProps } from '@dnd-kit/sortable'

import { composeEventHandlers, useComposedRefs } from '@/lib/composition'
import { cn } from '@/lib/utils'

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
    collisionDetection: closestCorners,
  },
}

const ROOT_NAME = 'Sortable'
const CONTENT_NAME = 'SortableContent'
const ITEM_NAME = 'SortableItem'
const ITEM_HANDLE_NAME = 'SortableItemHandle'
const OVERLAY_NAME = 'SortableOverlay'

type LocalSlotProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>
  [key: string]: unknown
}

function renderLocalSlot(
  asChild: boolean | undefined,
  fallback: keyof React.JSX.IntrinsicElements,
  props: LocalSlotProps,
) {
  const { children, className, style, ...slotProps } = props

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      className?: string
      style?: React.CSSProperties
    }>

    return React.cloneElement(child, {
      ...slotProps,
      ref: props.ref,
      className: cn(className, child.props.className),
      style: { ...child.props.style, ...style },
    } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> })
  }

  return React.createElement(
    fallback,
    { ...slotProps, ref: props.ref, className, style },
    children,
  )
}

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
  modifiers: DndContextProps['modifiers']
  strategy: SortableContextProps['strategy']
  activeId: UniqueIdentifier | null
  setActiveId: (id: UniqueIdentifier | null) => void
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

type SortableProps<T> = DndContextProps & {
  value: Array<T>
  onValueChange?: (items: Array<T>) => void
  onMove?: (
    event: DragEndEvent & { activeIndex: number; overIndex: number },
  ) => void
  strategy?: SortableContextProps['strategy']
  orientation?: 'vertical' | 'horizontal' | 'mixed'
  flatCursor?: boolean
} & (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>)

function Sortable<T>(props: SortableProps<T>) {
  const {
    id = React.useId(),
    value,
    onValueChange,
    modifiers,
    strategy,
    onMove,
    orientation = 'vertical',
    flatCursor = false,
    getItemValue: getItemValueProp,
    accessibility,
    ...sortableProps
  } = props
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
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
      const { active, over } = event
      if (over && active.id !== over.id) {
        const activeIndex = value.findIndex(
          (item) => getItemValue(item) === active.id,
        )
        const overIndex = value.findIndex(
          (item) => getItemValue(item) === over.id,
        )

        if (onMove) {
          onMove({ ...event, activeIndex, overIndex })
        } else {
          onValueChange?.(arrayMove(value, activeIndex, overIndex))
        }
      }
      setActiveId(null)
    },
    [value, onValueChange, onMove, getItemValue],
  )

  const announcements: Announcements = {
    onDragStart({ active }) {
      const activeValue = active.id.toString()
      return `Grabbed sortable item "${activeValue}". Current position is ${active.data.current?.sortable.index + 1} of ${value.length}. Use arrow keys to move, space to drop.`
    },
    onDragOver({ active, over }) {
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0
        const activeIndex = active.data.current?.sortable.index ?? 0
        const moveDirection = overIndex > activeIndex ? 'down' : 'up'
        const activeValue = active.id.toString()
        return `Sortable item "${activeValue}" moved ${moveDirection} to position ${overIndex + 1} of ${value.length}.`
      }
      return 'Sortable item is no longer over a droppable area. Press escape to cancel.'
    },
    onDragEnd({ active, over }) {
      const activeValue = active.id.toString()
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0
        return `Sortable item "${activeValue}" dropped at position ${overIndex + 1} of ${value.length}.`
      }
      return `Sortable item "${activeValue}" dropped. No changes were made.`
    },
    onDragCancel({ active }) {
      const activeIndex = active.data.current?.sortable.index ?? 0
      const activeValue = active.id.toString()
      return `Sorting cancelled. Sortable item "${activeValue}" returned to position ${activeIndex + 1} of ${value.length}.`
    },
    onDragMove({ active, over }) {
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0
        const activeIndex = active.data.current?.sortable.index ?? 0
        const moveDirection = overIndex > activeIndex ? 'down' : 'up'
        const activeValue = active.id.toString()
        return `Sortable item "${activeValue}" is moving ${moveDirection} to position ${overIndex + 1} of ${value.length}.`
      }
      return 'Sortable item is no longer over a droppable area. Press escape to cancel.'
    },
  }

  const screenReaderInstructions: ScreenReaderInstructions = React.useMemo(
    () => ({
      draggable: `
        To pick up a sortable item, press space or enter.
        While dragging, use the ${orientation === 'vertical' ? 'up and down' : orientation === 'horizontal' ? 'left and right' : 'arrow'} keys to move the item.
        Press space or enter again to drop the item in its new position, or press escape to cancel.
      `,
    }),
    [orientation],
  )

  const items = React.useMemo(() => {
    return value.map((item) => getItemValue(item))
  }, [value, getItemValue])

  const contextValue = React.useMemo(
    () => ({
      id,
      items,
      modifiers: modifiers ?? config.modifiers,
      strategy: strategy ?? config.strategy,
      activeId,
      setActiveId,
      getItemValue,
      flatCursor,
    }),
    [
      id,
      items,
      modifiers,
      strategy,
      config.modifiers,
      config.strategy,
      activeId,
      getItemValue,
      flatCursor,
    ],
  )

  return (
    <SortableRootContext.Provider
      value={contextValue as SortableRootContextValue<unknown>}
    >
      <DndContext
        id={id}
        modifiers={modifiers ?? config.modifiers}
        sensors={sensors}
        collisionDetection={config.collisionDetection}
        onDragStart={composeEventHandlers(
          sortableProps.onDragStart,
          ({ active }) => setActiveId(active.id),
        )}
        onDragEnd={composeEventHandlers(sortableProps.onDragEnd, onDragEnd)}
        onDragCancel={composeEventHandlers(sortableProps.onDragCancel, () =>
          setActiveId(null),
        )}
        accessibility={{
          announcements,
          screenReaderInstructions,
          ...accessibility,
        }}
        {...sortableProps}
      />
    </SortableRootContext.Provider>
  )
}

const SortableContentContext = React.createContext<boolean>(false)
SortableContentContext.displayName = CONTENT_NAME

interface SortableContentProps extends React.ComponentProps<'div'> {
  strategy?: SortableContextProps['strategy']
  children: React.ReactNode
  asChild?: boolean
  withoutSlot?: boolean
}

function SortableContent({
  ref,
  strategy: strategyProp,
  asChild,
  withoutSlot,
  children,
  ...contentProps
}: SortableContentProps) {
  const context = useSortableContext(CONTENT_NAME)

  return (
    <SortableContentContext.Provider value={true}>
      <SortableContext
        items={context.items}
        strategy={strategyProp ?? context.strategy}
      >
        {withoutSlot
          ? children
          : renderLocalSlot(asChild, 'div', {
              'data-slot': 'sortable-content',
              ...contentProps,
              ref,
              children,
            })}
      </SortableContext>
    </SortableContentContext.Provider>
  )
}

interface SortableItemContextValue {
  id: string
  attributes: React.HTMLAttributes<HTMLElement>
  listeners: DraggableSyntheticListeners | undefined
  setActivatorNodeRef: (node: HTMLElement | null) => void
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
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value, disabled })

  const composedRef = useComposedRefs(ref, (node) => {
    if (disabled) return
    setNodeRef(node)
    if (asHandle) setActivatorNodeRef(node)
  })

  const composedStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
    }
  }, [transform, transition, style])

  const itemContext = React.useMemo<SortableItemContextValue>(
    () => ({
      id,
      attributes,
      listeners,
      setActivatorNodeRef,
      isDragging,
      disabled,
    }),
    [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled],
  )

  return (
    <SortableItemContext.Provider value={itemContext}>
      {renderLocalSlot(asChild, 'div', {
        'data-slot': 'sortable-item',
        id,
        'data-dragging': isDragging ? '' : undefined,
        ...itemProps,
        ...(asHandle ? attributes : {}),
        ...(asHandle ? listeners : {}),
        tabIndex: disabled ? undefined : 0,
        ref: composedRef,
        style: composedStyle,
        className: cn(
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
        ),
      })}
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
    if (!isDisabled) return
    itemContext.setActivatorNodeRef(node)
  })

  return renderLocalSlot(asChild, 'button', {
    'data-slot': 'sortable-item-handle',
    type: 'button',
    'aria-controls': itemContext.id,
    'data-dragging': itemContext.isDragging ? '' : undefined,
    ...itemHandleProps,
    ...itemContext.attributes,
    ...itemContext.listeners,
    ref: composedRef,
    className: cn(
      'select-none disabled:pointer-events-none disabled:opacity-50',
      context.flatCursor
        ? 'cursor-default'
        : 'cursor-grab data-dragging:cursor-grabbing',
      className,
    ),
    disabled: isDisabled,
  })
}

const SortableOverlayContext = React.createContext(false)
SortableOverlayContext.displayName = OVERLAY_NAME

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
}

interface SortableOverlayProps extends Omit<
  React.ComponentProps<typeof DragOverlay>,
  'children'
> {
  container?: HTMLElement | DocumentFragment | null
  children?:
    | ((params: { value: UniqueIdentifier }) => React.ReactNode)
    | React.ReactNode
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
      modifiers={context.modifiers}
      dropAnimation={dropAnimation}
      className={cn(!context.flatCursor && 'cursor-grabbing')}
      {...overlayProps}
    >
      <SortableOverlayContext.Provider value={true}>
        {context.activeId
          ? typeof children === 'function'
            ? children({ value: context.activeId })
            : children
          : null}
      </SortableOverlayContext.Provider>
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
