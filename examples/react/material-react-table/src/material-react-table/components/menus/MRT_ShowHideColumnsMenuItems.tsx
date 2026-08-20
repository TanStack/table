import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { reorderColumn } from '../../utils/column.utils'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ColumnPinningButtons } from '../buttons/MRT_ColumnPinningButtons'
import { MRT_GrabHandleButton } from '../buttons/MRT_GrabHandleButton'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { MRT_Column, MRT_RowData } from '../../types'
import type { MenuItemProps } from '@mui/material/MenuItem'
import type { Dispatch, DragEvent, SetStateAction } from 'react'

export interface MRT_ShowHideColumnsMenuItemsProps<
  TData extends MRT_RowData,
> extends MenuItemProps {
  allColumns: Array<MRT_Column<TData>>
  column: MRT_Column<TData>
  hoveredColumn: MRT_Column<TData> | null
  isNestedColumns: boolean
  setHoveredColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>
}

export const MRT_ShowHideColumnsMenuItems = <TData extends MRT_RowData>({
  allColumns,
  column,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  ...rest
}: MRT_ShowHideColumnsMenuItemsProps<TData>) => {
  const table = useMRTContext<TData>()
  const {
    state,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
      mrtTheme: { draggingBorderColor },
    },
    setColumnOrder,
    setColumnPinning,
  } = table
  const { columnOrder } = state
  const { columnDef } = column
  const { columnDefType } = columnDef

  const switchChecked = column.getIsVisible()

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
    try {
      e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(false)
    setHoveredColumn(null)
    if (hoveredColumn) {
      const reorderedColumns = reorderColumn(column, hoveredColumn, columnOrder)
      setColumnOrder(reorderedColumns)
      setColumnPinning(({ start = [], end = [] }) => ({
        start: reorderedColumns.filter((header) => start.includes(header)),
        end: reorderedColumns.filter((header) => end.includes(header)),
      }))
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
      <MenuItem
        disableRipple
        onDragEnter={handleDragEnter}
        ref={menuItemRef as any}
        {...rest}
        sx={(theme) => ({
          alignItems: 'center',
          justifyContent: 'flex-start',
          my: 0,
          opacity: isDragging ? 0.5 : 1,
          outline: isDragging
            ? `2px dashed ${theme.palette.grey[500]}`
            : hoveredColumn?.id === column.id
              ? `2px dashed ${draggingBorderColor}`
              : 'none',
          outlineOffset: '-2px',
          pl: `${(column.depth + 0.5) * 2}rem`,
          py: '6px',
          ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '8px',
          }}
        >
          {columnDefType !== 'group' &&
            enableColumnOrdering &&
            !isNestedColumns &&
            (columnDef.enableColumnOrdering !== false ? (
              <MRT_GrabHandleButton
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              />
            ) : (
              <Box sx={{ width: '28px' }} />
            ))}
          {enableColumnPinning &&
            (column.getCanPin() ? (
              <MRT_ColumnPinningButtons column={column} />
            ) : (
              <Box sx={{ width: '70px' }} />
            ))}
          {enableHiding ? (
            <FormControlLabel
              checked={switchChecked}
              slotProps={{
                typography: {
                  sx: {
                    mb: 0,
                    opacity: columnDefType !== 'display' ? 1 : 0.5,
                  },
                },
              }}
              control={
                <Tooltip
                  {...getCommonTooltipProps()}
                  title={localization.toggleVisibility}
                >
                  <Switch />
                </Tooltip>
              }
              disabled={!column.getCanHide()}
              label={columnDef.header}
              onChange={() => handleToggleColumnHidden(column)}
            />
          ) : (
            <Typography sx={{ alignSelf: 'center' }}>
              {columnDef.header}
            </Typography>
          )}
        </Box>
      </MenuItem>
      {column.columns?.map((c: MRT_Column<TData>, i) => (
        <MRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          isNestedColumns={isNestedColumns}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
        />
      ))}
    </>
  )
}
