import { Column, Table } from '@tanstack/solid-table'
import { debounce } from '@solid-primitives/scheduled'
import { createMemo } from 'solid-js'

function ColumnFilter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = createMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  const debounceColumnFilter = debounce(
    value => column.setFilterValue(value),
    500
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onInput={e =>
            debounceColumnFilter((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onInput={e =>
            debounceColumnFilter((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues()
          .slice(0, 5000)
          .map((value: any) => (
            <option value={value} key={value} />
          ))}
      </datalist>
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onInput={e => debounceColumnFilter(e.target.value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

export default ColumnFilter
