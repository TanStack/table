'use client'

import * as React from 'react'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Box,
  Checkbox,
  Input,
  Menu,
  NativeSelect,
  Popover,
  Portal,
  Text,
} from '@chakra-ui/react'
import { IconArrowDown, IconArrowUp, IconArrowsSort } from '@tabler/icons-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Option = {
  value: string
  label: string
}

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

export function toSentenceCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1))
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function toDateInputValue(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// Text Input
// ---------------------------------------------------------------------------

export type TextInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'onChange'
> & {
  label?: string
  icon?: React.ReactNode
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export function TextInput({
  label,
  icon,
  ref: _ref,
  ...props
}: TextInputProps) {
  return (
    <Box flex={props.style?.flex}>
      {label ? (
        <Text fontSize="sm" fontWeight="medium" mb="1">
          {label}
        </Text>
      ) : null}
      <Box position="relative">
        {icon ? (
          <Box
            position="absolute"
            left="3"
            top="50%"
            translateY="-50%"
            color="fg.muted"
            pointerEvents="none"
          >
            {icon}
          </Box>
        ) : null}
        <Input ps={icon ? '9' : undefined} {...props} />
      </Box>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Select Field
// ---------------------------------------------------------------------------

export type SelectFieldProps = {
  'aria-label'?: string
  label?: string
  options: Array<string | Option>
  value?: string | null
  onChange?: (value: string | null) => void
  width?: string | number
  flex?: string | number
}

export function SelectField({
  'aria-label': ariaLabel,
  label,
  options,
  value,
  onChange,
  width,
  flex,
}: SelectFieldProps) {
  const normalizedOptions = options.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  )
  return (
    <Box width={width} flex={flex}>
      {label ? (
        <Text fontSize="sm" fontWeight="medium" mb="1">
          {label}
        </Text>
      ) : null}
      <NativeSelect.Root width="100%">
        <NativeSelect.Field
          aria-label={ariaLabel}
          value={value ?? ''}
          onChange={(event) => onChange?.(event.currentTarget.value || null)}
        >
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Multi-Select Field
// ---------------------------------------------------------------------------

export type MultiSelectFieldProps = {
  label?: string
  options: Array<string | Option>
  value?: Array<string>
  onChange?: (value: Array<string>) => void
  flex?: string | number
}

export function MultiSelectField({
  label,
  options,
  value = [],
  onChange,
  flex,
}: MultiSelectFieldProps) {
  const normalizedOptions = options.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  )
  return (
    <Box flex={flex}>
      {label ? (
        <Text fontSize="sm" fontWeight="medium" mb="1">
          {label}
        </Text>
      ) : null}
      <select
        multiple
        value={value}
        style={{
          width: '100%',
          minHeight: 40,
          padding: 8,
          border: '1px solid var(--chakra-colors-border)',
          borderRadius: 'var(--chakra-radii-md)',
          background: 'var(--chakra-colors-bg)',
        }}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          onChange?.(
            Array.from(event.currentTarget.selectedOptions).map(
              (option) => option.value,
            ),
          )
        }
      >
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Checkbox Field
// ---------------------------------------------------------------------------

export type CheckboxFieldProps = Omit<
  React.ComponentProps<'input'>,
  'checked' | 'onChange' | 'type'
> & {
  label?: string
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function CheckboxField({
  label,
  checked,
  indeterminate,
  onCheckedChange,
  ...props
}: CheckboxFieldProps) {
  return (
    <Checkbox.Root
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
    >
      <Checkbox.HiddenInput {...(props as any)} />
      <Checkbox.Control />
      {label ? <Checkbox.Label>{label}</Checkbox.Label> : null}
    </Checkbox.Root>
  )
}

// ---------------------------------------------------------------------------
// Chakra v3 dropdown / floating panel wrappers
// ---------------------------------------------------------------------------

export function useCloseOnOutsidePointerDown(
  open: boolean,
  refs:
    | React.RefObject<HTMLElement | null>
    | Array<React.RefObject<HTMLElement | null>>,
  onClose: () => void,
) {
  React.useEffect(() => {
    if (!open) return

    const refList = Array.isArray(refs) ? refs : [refs]
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      // The floating content (menu/popover) is rendered through a Portal, so
      // it lives outside the trigger's ref subtree. Check every registered ref
      // before treating a pointer-down as "outside" — otherwise clicking a
      // menu item would close the panel before its click handler runs.
      const inside = refList.some((ref) => ref.current?.contains(target))
      if (!inside) {
        onClose()
      }
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open, onClose, refs])
}

export const DropdownCloseContext = React.createContext<() => void>(
  () => undefined,
)

export function DropdownMenu({
  trigger,
  children,
  width = '180px',
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  width?: string | number
}) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const close = React.useCallback(() => setOpen(false), [])

  useCloseOnOutsidePointerDown(open, [rootRef, contentRef], close)

  return (
    <Box ref={rootRef} display="inline-block">
      <DropdownCloseContext.Provider value={close}>
        <Menu.Root
          open={open}
          onOpenChange={(details) => setOpen(details.open)}
          positioning={{ placement: 'bottom-end', offset: { mainAxis: 6 } }}
        >
          <Menu.Trigger asChild>{trigger}</Menu.Trigger>
          {/* Portal the content so it isn't clipped by a cell's
              `overflow: hidden` (row actions live inside such a cell). */}
          <Portal>
            <Menu.Positioner>
              <Menu.Content ref={contentRef} minW={width}>
                {children}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </DropdownCloseContext.Provider>
    </Box>
  )
}

export function DropdownMenuItem({
  value,
  icon,
  children,
  onSelect,
  disabled,
  colorPalette,
}: {
  value: string
  icon?: React.ReactNode
  children: React.ReactNode
  onSelect?: () => void
  disabled?: boolean
  colorPalette?: string
}) {
  const close = React.useContext(DropdownCloseContext)
  const hasHandledSelectionRef = React.useRef(false)
  const handleSelection = React.useCallback(() => {
    if (hasHandledSelectionRef.current) return

    hasHandledSelectionRef.current = true
    onSelect?.()
    close()
    queueMicrotask(() => {
      hasHandledSelectionRef.current = false
    })
  }, [close, onSelect])

  return (
    <Menu.Item
      value={value}
      disabled={disabled}
      colorPalette={colorPalette}
      onClick={handleSelection}
      onSelect={handleSelection}
    >
      {icon}
      {children}
    </Menu.Item>
  )
}

export function FloatingPanel({
  open,
  onOpenChange,
  width = '320px',
  trigger,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  width?: string | number
  trigger: React.ReactNode
  children: React.ReactNode
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])

  useCloseOnOutsidePointerDown(open, [rootRef, contentRef], close)

  return (
    <Box ref={rootRef} display="inline-block">
      <Popover.Root
        open={open}
        onOpenChange={(details) => onOpenChange(details.open)}
        positioning={{ placement: 'bottom-end', offset: { mainAxis: 6 } }}
      >
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              ref={contentRef}
              width={width}
              maxW="calc(100vw - 32px)"
            >
              <Popover.Body>{children}</Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Sortable Frame (dnd-kit)
// ---------------------------------------------------------------------------

export function SortableFrame({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
      }}
    >
      {children}
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Sort Icon
// ---------------------------------------------------------------------------

export function SortIcon({
  direction,
}: {
  direction: 'asc' | 'desc' | undefined
}) {
  if (direction === 'asc') return <IconArrowUp size={16} />
  if (direction === 'desc') return <IconArrowDown size={16} />
  return <IconArrowsSort className="sort-icon-unsorted" size={16} />
}

// ---------------------------------------------------------------------------
// Ellipsis Text
// ---------------------------------------------------------------------------

export function EllipsisText({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="span"
      style={{
        display: 'block',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Re-export dnd-kit helpers used by multiple extracted components
// ---------------------------------------------------------------------------

export { SortableContext, verticalListSortingStrategy }
