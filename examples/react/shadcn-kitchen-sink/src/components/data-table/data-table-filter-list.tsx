'use client'

import type {
  Column,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'

interface DataTableFilterListProps<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
> {
  column: Column<Pick<TFeatures, 'columnFilteringFeature'>, TRowData>
  table: Table<TFeatures, TRowData>
}

export function DataTableFilterList<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
>({ column, table }: DataTableFilterListProps<TFeatures, TRowData>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <Input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="h-8 w-20"
      />
      <Input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="h-8 w-20"
      />
    </div>
  ) : (
    <Input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="h-8 max-w-sm"
    />
  )
}
