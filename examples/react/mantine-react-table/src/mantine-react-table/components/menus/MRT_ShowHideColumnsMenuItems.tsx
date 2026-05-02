
import {
  
  
  
  useRef,
  useState
} from 'react'

import {
  Box,
  Menu,
  Switch,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'

import { reorderColumn } from '../../utils/column.utils'
import { dataVariable, getPrimaryColor } from '../../utils/style.utils'
import { MRT_ColumnPinningButtons } from '../buttons/MRT_ColumnPinningButtons'
import { MRT_GrabHandleButton } from '../buttons/MRT_GrabHandleButton'
import classes from './MRT_ShowHideColumnsMenuItems.module.css'
import type {MRT_CellValue, MRT_Column, MRT_RowData, MRT_TableInstance} from '../../types';
import type {Dispatch, DragEvent, SetStateAction} from 'react';

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
  allColumns: Array<MRT_Column<TData>>
  column: MRT_Column<TData, TValue>
  hoveredColumn: MRT_Column<TData> | null
  setHoveredColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>
  table: MRT_TableInstance<TData>
}

export const MRT_ShowHideColumnsMenuItems = <TData extends MRT_RowData>({
  allColumns,
  column,
  hoveredColumn,
  setHoveredColumn,
  table,
}: Props<TData>) => {
  const theme = useMantineTheme()
  const {
    state,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
    setColumnOrder,
  } = table
  const { columnOrder } = state
  const { columnDef } = column
  const { columnDefType } = columnDef

  const switchChecked =
    (columnDefType !== 'group' && column.getIsVisible()) ||
    (columnDefType === 'group' &&
      column.getLeafColumns().some((col) => col.getIsVisible()))

  const handleToggleColumnHidden = (column: MRT_Column<TData>) => {
    if (columnDefType === 'group') {
      column?.columns?.forEach?.((childColumn: MRT_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked)
      })
    } else {
      column.toggleVisibility()
    }
  }

  const menuItemRef = useRef<HTMLElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true)
    e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0)
  }

  const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(false)
    setHoveredColumn(null)
    if (hoveredColumn) {
      setColumnOrder(reorderColumn(column, hoveredColumn, columnOrder))
    }
  }

  const handleDragEnter = (_e: DragEvent) => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column)
    }
  }

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null
  }

  return (
    <>
      <Menu.Item
        className={classes.root}
        component="span"
        onDragEnter={handleDragEnter}
        ref={menuItemRef}
        style={{
          '--_column-depth': `${(column.depth + 0.5) * 2}rem`,
          '--_hover-color': getPrimaryColor(theme),
        }}
        {...dataVariable('dragging', isDragging)}
        {...dataVariable('order-hovered', hoveredColumn?.id === column.id)}
      >
        <Box className={classes.menu}>
          {columnDefType !== 'group' &&
            enableColumnOrdering &&
            !allColumns.some(
              (col) => col.columnDef.columnDefType === 'group',
            ) &&
            (columnDef.enableColumnOrdering !== false ? (
              <MRT_GrabHandleButton
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                table={table}
              />
            ) : (
              <Box className={classes.grab} />
            ))}
          {enableColumnPinning &&
            (column.getCanPin() ? (
              <MRT_ColumnPinningButtons column={column} table={table} />
            ) : (
              <Box className={classes.pin} />
            ))}
          {enableHiding ? (
            <Tooltip
              label={localization.toggleVisibility}
              openDelay={1000}
              withinPortal
            >
              <Switch
                checked={switchChecked}
                className={classes.switch}
                disabled={!column.getCanHide()}
                label={columnDef.header}
                onChange={() => handleToggleColumnHidden(column)}
              />
            </Tooltip>
          ) : (
            <Text className={classes.header}>{columnDef.header}</Text>
          )}
        </Box>
      </Menu.Item>
      {column.columns?.map((c: MRT_Column<TData>, i) => (
        <MRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </>
  )
}
