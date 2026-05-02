import { useState } from 'react'
import Menu from '@mui/material/Menu'
import { MRT_ActionMenuItem } from './MRT_ActionMenuItem'
import { MRT_FilterOptionMenu } from './MRT_FilterOptionMenu'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'
import type { MenuProps } from '@mui/material/Menu'
import type { MouseEvent } from 'react'

export interface MRT_ColumnActionMenuProps<
  TData extends MRT_RowData,
> extends Partial<MenuProps> {
  anchorEl: HTMLElement | null
  header: MRT_Header<TData>
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  table: MRT_TableInstance<TData>
}

export const MRT_ColumnActionMenu = <TData extends MRT_RowData>({
  anchorEl,
  header,
  setAnchorEl,
  table,
  ...rest
}: MRT_ColumnActionMenuProps<TData>) => {
  const {
    getAllLeafColumns,
    state,
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      enableColumnFilterModes,
      enableColumnFilters,
      enableColumnPinning,
      enableColumnResizing,
      enableGrouping,
      enableHiding,
      enableSorting,
      enableSortingRemoval,
      icons: {
        ClearAllIcon,
        DynamicFeedIcon,
        FilterListIcon,
        FilterListOffIcon,
        PushPinIcon,
        RestartAltIcon,
        SortIcon,
        ViewColumnIcon,
        VisibilityOffIcon,
      },
      localization,
      mrtTheme: { menuBackgroundColor },
      renderColumnActionsMenuItems,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
    setColumnOrder,
    setColumnResizing,
    setShowColumnFilters,
  } = table
  const { column } = header
  const { columnDef } = column
  const { columnSizing, columnVisibility, density, showColumnFilters } = state
  const columnFilterValue = column.getFilterValue()

  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<HTMLElement | null>(null)

  const handleClearSort = () => {
    column.clearSorting()
    setAnchorEl(null)
  }

  const handleSortAsc = () => {
    column.toggleSorting(false)
    setAnchorEl(null)
  }

  const handleSortDesc = () => {
    column.toggleSorting(true)
    setAnchorEl(null)
  }

  const handleResetColumnSize = () => {
    setColumnResizing((old) => ({ ...old, isResizingColumn: false }))
    column.resetSize()
    setAnchorEl(null)
  }

  const handleHideColumn = () => {
    column.toggleVisibility(false)
    setAnchorEl(null)
  }

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection)
    setAnchorEl(null)
  }

  const handleGroupByColumn = () => {
    column.toggleGrouping()
    setColumnOrder((old: any) => ['mrt-row-expand', ...old])
    setAnchorEl(null)
  }

  const handleClearFilter = () => {
    column.setFilterValue(undefined)
    setAnchorEl(null)
    if (['empty', 'notEmpty'].includes(columnDef._filterFn)) {
      setColumnFilterFns((prev) => ({
        ...prev,
        [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
      }))
    }
  }

  const handleFilterByColumn = () => {
    setShowColumnFilters(true)
    queueMicrotask(() => filterInputRefs.current?.[`${column.id}-0`]?.focus())
    setAnchorEl(null)
  }

  const handleShowAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true))
    setAnchorEl(null)
  }

  const handleOpenFilterModeMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setFilterMenuAnchorEl(event.currentTarget)
  }

  const isSelectFilter = !!columnDef.filterSelectOptions

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions

  const showFilterModeSubMenu =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !isSelectFilter &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)

  const internalColumnMenuItems = [
    ...(enableSorting && column.getCanSort()
      ? [
          enableSortingRemoval !== false && (
            <MRT_ActionMenuItem
              disabled={column.getIsSorted() === false}
              icon={<ClearAllIcon />}
              key={0}
              label={localization.clearSort}
              onClick={handleClearSort}
              table={table}
            />
          ),
          <MRT_ActionMenuItem
            disabled={column.getIsSorted() === 'asc'}
            icon={
              <SortIcon style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
            }
            key={1}
            label={localization.sortByColumnAsc?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleSortAsc}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={column.getIsSorted() === 'desc'}
            divider={enableColumnFilters || enableGrouping || enableHiding}
            icon={<SortIcon />}
            key={2}
            label={localization.sortByColumnDesc?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleSortDesc}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnFilters && column.getCanFilter()
      ? [
          <MRT_ActionMenuItem
            disabled={
              !columnFilterValue ||
              (Array.isArray(columnFilterValue) &&
                !columnFilterValue.filter((value) => value).length)
            }
            icon={<FilterListOffIcon />}
            key={3}
            label={localization.clearFilter}
            onClick={handleClearFilter}
            table={table}
          />,
          columnFilterDisplayMode === 'subheader' && (
            <MRT_ActionMenuItem
              disabled={showColumnFilters && !enableColumnFilterModes}
              divider={enableGrouping || enableHiding}
              icon={<FilterListIcon />}
              key={4}
              label={localization.filterByColumn?.replace(
                '{column}',
                String(columnDef.header),
              )}
              onClick={
                showColumnFilters
                  ? handleOpenFilterModeMenu
                  : handleFilterByColumn
              }
              onOpenSubMenu={
                showFilterModeSubMenu ? handleOpenFilterModeMenu : undefined
              }
              table={table}
            />
          ),
          showFilterModeSubMenu && (
            <MRT_FilterOptionMenu
              anchorEl={filterMenuAnchorEl}
              header={header}
              key={5}
              onSelect={handleFilterByColumn}
              setAnchorEl={setFilterMenuAnchorEl}
              table={table}
            />
          ),
        ].filter(Boolean)
      : []),
    ...(enableGrouping && column.getCanGroup()
      ? [
          <MRT_ActionMenuItem
            divider={enableColumnPinning}
            icon={<DynamicFeedIcon />}
            key={6}
            label={localization[
              column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'
            ]?.replace('{column}', String(columnDef.header))}
            onClick={handleGroupByColumn}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnPinning && column.getCanPin()
      ? [
          <MRT_ActionMenuItem
            disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
            icon={<PushPinIcon style={{ transform: 'rotate(90deg)' }} />}
            key={7}
            label={localization.pinToLeft}
            onClick={() => handlePinColumn('left')}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
            icon={<PushPinIcon style={{ transform: 'rotate(-90deg)' }} />}
            key={8}
            label={localization.pinToRight}
            onClick={() => handlePinColumn('right')}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={!column.getIsPinned()}
            divider={enableHiding}
            icon={<PushPinIcon />}
            key={9}
            label={localization.unpin}
            onClick={() => handlePinColumn(false)}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnResizing && column.getCanResize()
      ? [
          <MRT_ActionMenuItem
            disabled={columnSizing[column.id] === undefined}
            icon={<RestartAltIcon />}
            key={10}
            label={localization.resetColumnSize}
            onClick={handleResetColumnSize}
            table={table}
          />,
        ]
      : []),
    ...(enableHiding
      ? [
          <MRT_ActionMenuItem
            disabled={!column.getCanHide()}
            icon={<VisibilityOffIcon />}
            key={11}
            label={localization.hideColumn?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleHideColumn}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={
              !Object.values(columnVisibility).filter((visible) => !visible)
                .length
            }
            icon={<ViewColumnIcon />}
            key={12}
            label={localization.showAllColumns?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleShowAllColumns}
            table={table}
          />,
        ]
      : []),
  ].filter(Boolean)

  return (
    <Menu
      slotProps={{
        list: {
          dense: density === 'compact',
          sx: {
            backgroundColor: menuBackgroundColor,
          },
        },
      }}
      anchorEl={anchorEl}
      disableScrollLock
      onClose={() => setAnchorEl(null)}
      open={!!anchorEl}
      {...rest}
    >
      {columnDef.renderColumnActionsMenuItems?.({
        closeMenu: () => setAnchorEl(null),
        column,
        internalColumnMenuItems,
        table,
      }) ??
        renderColumnActionsMenuItems?.({
          closeMenu: () => setAnchorEl(null),
          column,
          internalColumnMenuItems,
          table,
        }) ??
        internalColumnMenuItems}
    </Menu>
  )
}
