import * as React from 'react'
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Key } from 'react-aria-components'

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function toSentenceCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1))
}

export function SelectionCheckbox({
  ariaLabel,
  isSelected,
  isIndeterminate,
  onChange,
}: {
  ariaLabel: string
  isSelected: boolean
  isIndeterminate?: boolean
  onChange: (selected: boolean) => void
}) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!isIndeterminate
  }, [isIndeterminate])

  return (
    <input
      ref={ref}
      aria-label={ariaLabel}
      aria-checked={isIndeterminate ? 'mixed' : isSelected}
      checked={isSelected}
      className="native-checkbox"
      type="checkbox"
      onChange={(event) => onChange(event.currentTarget.checked)}
    />
  )
}

export function AriaSelect({
  label,
  value,
  options,
  className,
  showLabel = true,
  onChange,
}: {
  label: string
  value: string | null
  options: Array<{ value: string; label: string }>
  className?: string
  showLabel?: boolean
  onChange: (value: string) => void
}) {
  return (
    <Select
      aria-label={label}
      className={cx('react-aria-select', className)}
      selectedKey={value}
      onSelectionChange={(key: Key | null) => {
        if (key != null) onChange(String(key))
      }}
    >
      {showLabel ? <Label>{label}</Label> : null}
      <Button>
        <SelectValue />
        <span aria-hidden="true">&#x2304;</span>
      </Button>
      <Popover>
        <ListBox>
          {options.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

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
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-grab"
      style={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {children}
    </div>
  )
}
