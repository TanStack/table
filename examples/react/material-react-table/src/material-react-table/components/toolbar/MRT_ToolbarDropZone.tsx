import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_RowData, MRT_TableInstance } from '../../types'
import type { BoxProps } from '@mui/material/Box'
import type { DragEvent } from 'react'

export interface MRT_ToolbarDropZoneProps<
  TData extends MRT_RowData,
> extends BoxProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ToolbarDropZone = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToolbarDropZoneProps<TData>) => {
  const {
    state,
    options: { enableGrouping, localization },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table

  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } = state

  const handleDragEnter = (_event: DragEvent<HTMLDivElement>) => {
    setHoveredColumn({ id: 'drop-zone' })
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (table.options.state?.showToolbarDropZone !== undefined) {
      setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      )
    }
  }, [enableGrouping, draggingColumn, grouping])

  return (
    <Fade in={showToolbarDropZone}>
      <Box
        className="Mui-ToolbarDropZone"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        {...rest}
        sx={(theme) => ({
          alignItems: 'center',
          backdropFilter: 'blur(4px)',
          backgroundColor: alpha(
            theme.palette.info.main,
            hoveredColumn?.id === 'drop-zone' ? 0.2 : 0.1,
          ),
          border: `dashed ${theme.palette.info.main} 2px`,
          boxSizing: 'border-box',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
          zIndex: 4,
          ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
        })}
      >
        <Typography sx={{ fontStyle: 'italic' }}>
          {localization.dropToGroupBy.replace(
            '{column}',
            draggingColumn?.columnDef?.header ?? '',
          )}
        </Typography>
      </Box>
    </Fade>
  )
}
