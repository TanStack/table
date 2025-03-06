'use client'

import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react'
import type { Column, RowData, TableFeatures } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

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
  if (!column.getCanSort()) {
    return <div>{title}</div>
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="size-full justify-start rounded-none text-left"
    >
      <span className="flex-1">{title}</span>
      {column.getIsSorted() === 'desc' ? (
        <ArrowDown className="size-4" aria-hidden="true" />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUp className="size-4" aria-hidden="true" />
      ) : (
        <ChevronDown className="size-4" aria-hidden="true" />
      )}
    </Button>
  )
}
