import Badge from '@mui/material/Badge'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { TableSortLabelProps } from '@mui/material/TableSortLabel'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_TableHeadCellSortLabelProps<
  TData extends MRT_RowData,
> extends TableSortLabelProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellSortLabel = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellSortLabelProps<TData>) => {
  const {
    state,
    options: {
      icons: { ArrowDownwardIcon, SyncAltIcon },
      localization,
    },
  } = table
  const { column } = header
  const { columnDef } = column
  const { isLoading, showSkeletons, sorting } = state

  const isSorted = !!column.getIsSorted()

  const sortTooltip =
    isLoading || showSkeletons
      ? ''
      : column.getIsSorted()
        ? column.getIsSorted() === 'desc'
          ? localization.sortedByColumnDesc.replace(
              '{column}',
              columnDef.header,
            )
          : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
        : column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc.replace('{column}', columnDef.header)
          : localization.sortByColumnAsc.replace('{column}', columnDef.header)

  const direction = isSorted
    ? (column.getIsSorted() as 'asc' | 'desc')
    : undefined

  return (
    <Tooltip placement="top" title={sortTooltip}>
      <Badge
        badgeContent={sorting.length > 1 ? column.getSortIndex() + 1 : 0}
        overlap="circular"
      >
        <TableSortLabel
          IconComponent={
            !isSorted
              ? (props) => (
                  <SyncAltIcon
                    {...props}
                    direction={direction}
                    style={{
                      transform: 'rotate(-90deg) scaleX(0.9) translateX(-1px)',
                    }}
                  />
                )
              : ArrowDownwardIcon
          }
          active
          aria-label={sortTooltip}
          direction={direction}
          onClick={(e) => {
            e.stopPropagation()
            header.column.getToggleSortingHandler()?.(e)
          }}
          {...rest}
          sx={(theme) => ({
            '.MuiTableSortLabel-icon': {
              color: `${
                theme.palette.mode === 'dark'
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary
              } !important`,
            },
            flex: '0 0',
            opacity: isSorted ? 1 : 0.3,
            transition: 'all 150ms ease-in-out',
            width: '3ch',
            ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
          })}
        />
      </Badge>
    </Tooltip>
  )
}
