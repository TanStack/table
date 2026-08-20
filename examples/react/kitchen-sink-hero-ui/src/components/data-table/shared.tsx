'use client'

import * as React from 'react'
import { Label, ListBox, ListBoxItem, Select } from '@heroui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Key } from '@heroui/react'

export function toSentenceCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1))
}

export function formatDate(value: unknown) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(String(value)))
}

export function toDateInputValue(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

export function HeroSelect({
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
      className={className}
      selectedKey={value}
      onSelectionChange={(key: Key | null) => {
        if (key != null) onChange(String(key))
      }}
    >
      {showLabel ? <Label>{label}</Label> : null}
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
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
      </Select.Popover>
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
