import * as React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Box from '@mui/material/Box'

export function toSentenceCase(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1))
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function toDateInputValue(value: unknown): string {
  if (!value) return ''
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

export function SortableFrame({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}): React.ReactNode {
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
      sx={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {children}
    </Box>
  )
}

export function EllipsisText({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <Box
      component="span"
      sx={{
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
