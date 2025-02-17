'use client'

import { SelectIcon } from '@radix-ui/react-select'
import { ArrowDown, ArrowUp, ChevronDown, EyeOff } from 'lucide-react'
import type { Column, RowData, TableFeatures } from '@tanstack/react-table'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

interface DataTableColumnHeaderProps {
  column: Column<
    Pick<TableFeatures, 'rowSortingFeature' | 'columnVisibilityFeature'>,
    RowData
  >
  title: string
}

export function DataTableColumnHeader({
  column,
  title,
}: DataTableColumnHeaderProps) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div>{title}</div>
  }

  const ascValue = `${column.id}-asc`
  const descValue = `${column.id}-desc`
  const hideValue = `${column.id}-hide`

  return (
    <Select
      value={
        column.getIsSorted() === 'desc'
          ? descValue
          : column.getIsSorted() === 'asc'
            ? ascValue
            : undefined
      }
      onValueChange={(value) => {
        if (value === ascValue) column.toggleSorting(false)
        else if (value === descValue) column.toggleSorting(true)
        else if (value === hideValue) column.toggleVisibility(false)
      }}
    >
      <SelectTrigger
        aria-label={
          column.getIsSorted() === 'desc'
            ? 'Sorted descending. Click to sort ascending.'
            : column.getIsSorted() === 'asc'
              ? 'Sorted ascending. Click to sort descending.'
              : 'Not sorted. Click to sort ascending.'
        }
        className="size-full border-none rounded-none shadow-none text-xs hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent [&>svg:last-child]:hidden"
      >
        {title}
        <SelectIcon asChild>
          {column.getCanSort() && column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2.5 size-4" aria-hidden="true" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2.5 size-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="ml-2.5 size-4" aria-hidden="true" />
          )}
        </SelectIcon>
      </SelectTrigger>
      <SelectContent align="start">
        {column.getCanSort() && (
          <>
            <SelectItem value={ascValue}>
              <span className="flex items-center">
                <ArrowUp
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Asc
              </span>
            </SelectItem>
            <SelectItem value={descValue}>
              <span className="flex items-center">
                <ArrowDown
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Desc
              </span>
            </SelectItem>
          </>
        )}
        {column.getCanHide() && (
          <SelectItem value={hideValue}>
            <span className="flex items-center">
              <EyeOff
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Hide
            </span>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
