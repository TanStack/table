import clsx from 'clsx'

import { TableTh, useDirection } from '@mantine/core'

import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MRT_TableFooterCell.module.css'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'
import type { TableThProps } from '@mantine/core'
import type { CSSProperties } from 'react'

interface Props<TData extends MRT_RowData> extends TableThProps {
  footer: MRT_Header<TData>
  renderedColumnIndex?: number
  table: MRT_TableInstance<TData>
}

export const MRT_TableFooterCell = <TData extends MRT_RowData>({
  footer,
  renderedColumnIndex,
  table,
  ...rest
}: Props<TData>) => {
  const direction = useDirection()
  const {
    options: { enableColumnPinning, layoutMode, mantineTableFooterCellProps },
  } = table
  const { column } = footer
  const { columnDef } = column
  const { columnDefType } = columnDef

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned()

  const args = { column, table }
  const tableCellProps = {
    ...parseFromValuesOrFunc(mantineTableFooterCellProps, args),
    ...parseFromValuesOrFunc(columnDef.mantineTableFooterCellProps, args),
    ...rest,
  }

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--header-${parseCSSVarId(
      footer?.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--header-${parseCSSVarId(footer.id)}-size) * 1px)`,
  }
  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--header-${parseCSSVarId(footer.id)}-size)`
    } 0 auto`
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
  }

  return (
    <TableTh
      colSpan={footer.colSpan}
      data-column-pinned={isColumnPinned || undefined}
      data-first-right-pinned={
        (isColumnPinned === 'right' &&
          column.getIsFirstColumn(isColumnPinned)) ||
        undefined
      }
      data-index={renderedColumnIndex}
      data-last-left-pinned={
        (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) ||
        undefined
      }
      {...tableCellProps}
      __vars={{
        '--mrt-cell-align':
          tableCellProps.align ??
          (columnDefType === 'group'
            ? 'center'
            : direction.dir === 'rtl'
              ? 'right'
              : 'left'),
        '--mrt-table-cell-left':
          isColumnPinned === 'left'
            ? `${column.getStart(isColumnPinned)}`
            : undefined,
        '--mrt-table-cell-right':
          isColumnPinned === 'right'
            ? `${column.getAfter(isColumnPinned)}`
            : undefined,
        ...tableCellProps?.__vars,
      }}
      className={clsx(
        classes.root,
        layoutMode?.startsWith('grid') && classes.grid,
        columnDefType === 'group' && classes.group,
        tableCellProps?.className,
      )}
      style={(theme) => ({
        ...widthStyles,
        ...parseFromValuesOrFunc(tableCellProps.style, theme),
      })}
    >
      {tableCellProps.children ??
        (footer.isPlaceholder
          ? null
          : (parseFromValuesOrFunc(columnDef.Footer, {
              column,
              footer,
              table,
            }) ??
            columnDef.footer ??
            null))}
    </TableTh>
  )
}
