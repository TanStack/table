import { alpha, darken, lighten } from '@mui/material/styles'
import { parseFromValuesOrFunc } from './utils'
import type { CSSProperties } from 'react'
import type { TableCellProps } from '@mui/material/TableCell'
import type { TooltipProps } from '@mui/material/Tooltip'
import type { Theme } from '@mui/material/styles'
import type {
  MRT_Column,
  MRT_Header,
  MRT_RowData,
  MRT_TableInstance,
  MRT_TableOptions,
  MRT_Theme,
} from '../types'

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_')

export const getMRTTheme = <TData extends MRT_RowData>(
  mrtTheme: MRT_TableOptions<TData>['mrtTheme'],
  muiTheme: Theme,
): MRT_Theme => {
  const mrtThemeOverrides = parseFromValuesOrFunc(mrtTheme, muiTheme)
  const baseBackgroundColor =
    mrtThemeOverrides?.baseBackgroundColor ??
    (muiTheme.palette.mode === 'dark'
      ? lighten(muiTheme.palette.background.default, 0.05)
      : muiTheme.palette.background.default)
  return {
    baseBackgroundColor,
    cellNavigationOutlineColor: muiTheme.palette.primary.main,
    draggingBorderColor: muiTheme.palette.primary.main,
    matchHighlightColor:
      muiTheme.palette.mode === 'dark'
        ? darken(muiTheme.palette.warning.dark, 0.25)
        : lighten(muiTheme.palette.warning.light, 0.5),
    menuBackgroundColor: lighten(baseBackgroundColor, 0.07),
    pinnedRowBackgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
    selectedRowBackgroundColor: alpha(muiTheme.palette.primary.main, 0.2),
    ...mrtThemeOverrides,
  }
}

export const commonCellBeforeAfterStyles = {
  content: '""',
  height: '100%',
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: -1,
}

export const getCommonPinnedCellStyles = <TData extends MRT_RowData>({
  column,
  table,
  theme,
}: {
  column?: MRT_Column<TData>
  table: MRT_TableInstance<TData>
  theme: Theme
}) => {
  const { baseBackgroundColor } = table.options.mrtTheme
  const isPinned = column?.getIsPinned()

  return {
    '&[data-pinned="true"]': {
      '&:before': {
        backgroundColor: alpha(
          darken(
            baseBackgroundColor,
            theme.palette.mode === 'dark' ? 0.05 : 0.01,
          ),
          0.97,
        ),
        boxShadow: column
          ? isPinned === 'left' && column.getIsLastColumn(isPinned)
            ? `-4px 0 4px -4px ${alpha(theme.palette.grey[700], 0.5)} inset`
            : isPinned === 'right' && column.getIsFirstColumn(isPinned)
              ? `4px 0 4px -4px ${alpha(theme.palette.grey[700], 0.5)} inset`
              : undefined
          : undefined,
        ...commonCellBeforeAfterStyles,
      },
    },
  }
}

export const getCommonMRTCellStyles = <TData extends MRT_RowData>({
  column,
  header,
  table,
  tableCellProps,
  theme,
}: {
  column: MRT_Column<TData>
  header?: MRT_Header<TData>
  table: MRT_TableInstance<TData>
  tableCellProps: TableCellProps
  theme: Theme
}) => {
  const {
    state,
    options: { enableColumnVirtualization, layoutMode },
  } = table
  const { draggingColumn } = state
  const { columnDef } = column
  const { columnDefType } = columnDef

  const isColumnPinned =
    columnDef.columnDefType !== 'group' && column.getIsPinned()

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px)`,
  }

  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--${header ? 'header' : 'col'}-${parseCSSVarId(
            header?.id ?? column.id,
          )}-size)`
    } 0 auto`
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
  }

  const pinnedStyles = isColumnPinned
    ? {
        ...getCommonPinnedCellStyles({ column, table, theme }),
        left:
          isColumnPinned === 'left'
            ? `${column.getStart('left')}px`
            : undefined,
        opacity: 0.97,
        position: 'sticky',
        right:
          isColumnPinned === 'right'
            ? `${column.getAfter('right')}px`
            : undefined,
      }
    : {}

  return {
    backgroundColor: 'inherit',
    backgroundImage: 'inherit',
    display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
    justifyContent:
      columnDefType === 'group'
        ? 'center'
        : layoutMode?.startsWith('grid')
          ? tableCellProps.align
          : undefined,
    opacity:
      table.state.draggingColumn?.id === column.id ||
      table.state.hoveredColumn?.id === column.id
        ? 0.5
        : 1,
    position: 'relative',
    transition: enableColumnVirtualization
      ? 'none'
      : `padding 150ms ease-in-out`,
    zIndex:
      column.getIsResizing() || draggingColumn?.id === column.id
        ? 2
        : columnDefType !== 'group' && isColumnPinned
          ? 1
          : 0,
    '&:focus-visible': {
      outline: `2px solid ${table.options.mrtTheme.cellNavigationOutlineColor}`,
      outlineOffset: '-2px',
    },
    ...pinnedStyles,
    ...widthStyles,
    ...(parseFromValuesOrFunc(tableCellProps?.sx, theme) as any),
  }
}

export const getCommonToolbarStyles = <TData extends MRT_RowData>({
  table,
}: {
  table: MRT_TableInstance<TData>
  theme: Theme
}) => ({
  alignItems: 'flex-start',
  backgroundColor: table.options.mrtTheme.baseBackgroundColor,
  display: 'grid',
  flexWrap: 'wrap-reverse',
  minHeight: '3.5rem',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 150ms ease-in-out',
  zIndex: 1,
})

export const flipIconStyles = (theme: Theme) =>
  theme.direction === 'rtl' ? { style: { transform: 'scaleX(-1)' } } : undefined

export const getCommonTooltipProps = (
  placement?: TooltipProps['placement'],
): Partial<TooltipProps> => ({
  disableInteractive: true,
  enterDelay: 1000,
  enterNextDelay: 1000,
  placement,
})
