import { Fragment, useMemo } from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Stack from '@mui/material/Stack'
import { getMRT_SelectAllHandler } from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_SelectCheckbox } from '../inputs/MRT_SelectCheckbox'
import type { MRT_RowData, MRT_TableInstance } from '../../types'
import type { AlertProps } from '@mui/material/Alert'

export interface MRT_ToolbarAlertBannerProps<
  TData extends MRT_RowData,
> extends AlertProps {
  stackAlertBanner?: boolean
  table: MRT_TableInstance<TData>
}

export const MRT_ToolbarAlertBanner = <TData extends MRT_RowData>({
  stackAlertBanner,
  table,
  ...rest
}: MRT_ToolbarAlertBannerProps<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getCoreRowModel,
    state,
    options: {
      enableRowSelection,
      enableSelectAll,
      localization,
      manualPagination,
      muiToolbarAlertBannerChipProps,
      muiToolbarAlertBannerProps,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
    refs: { tablePaperRef },
  } = table
  const { density, grouping, rowSelection, showAlertBanner } = state

  const alertProps = {
    ...parseFromValuesOrFunc(muiToolbarAlertBannerProps, {
      table,
    }),
    ...rest,
  }

  const chipProps = parseFromValuesOrFunc(muiToolbarAlertBannerChipProps, {
    table,
  })

  const totalRowCount = rowCount ?? getCoreRowModel().rows.length
  const filteredRowCount = getFilteredSelectedRowModel().rows.length

  const selectedRowCount = useMemo(
    () =>
      manualPagination
        ? Object.values(rowSelection).filter(Boolean).length
        : filteredRowCount,
    [rowSelection, totalRowCount, manualPagination, filteredRowCount],
  )
  const selectedAlert =
    selectedRowCount > 0 ? (
      <Stack direction="row" sx={{ alignItems: 'center', gap: '16px' }}>
        {localization.selectedCountOfRowCountRowsSelected
          ?.replace(
            '{selectedCount}',
            selectedRowCount.toLocaleString(localization.language),
          )
          ?.replace(
            '{rowCount}',
            totalRowCount.toLocaleString(localization.language),
          )}
        <Button
          onClick={(event) =>
            getMRT_SelectAllHandler({ table })(event, false, true)
          }
          size="small"
          sx={{ p: '2px' }}
        >
          {localization.clearSelection}
        </Button>
      </Stack>
    ) : null

  const groupedAlert =
    grouping.length > 0 ? (
      <span>
        {localization.groupedBy}{' '}
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}`}>
            {index > 0 ? localization.thenBy : ''}
            <Chip
              label={table.getColumn(columnId).columnDef.header}
              onDelete={() => table.getColumn(columnId).toggleGrouping()}
              {...chipProps}
            />
          </Fragment>
        ))}
      </span>
    ) : null

  return (
    <Collapse
      in={showAlertBanner || !!selectedAlert || !!groupedAlert}
      timeout={stackAlertBanner ? 200 : 0}
    >
      <Alert
        color="info"
        icon={false}
        {...alertProps}
        sx={(theme) => ({
          '& .MuiAlert-message': {
            maxWidth: `calc(${
              tablePaperRef.current?.clientWidth ?? 360
            }px - 1rem)`,
            width: '100%',
          },
          borderRadius: 0,
          fontSize: '1rem',
          left: 0,
          mb: stackAlertBanner
            ? 0
            : positionToolbarAlertBanner === 'bottom'
              ? '-1rem'
              : undefined,
          p: 0,
          position: 'relative',
          right: 0,
          top: 0,
          width: '100%',
          zIndex: 2,
          ...(parseFromValuesOrFunc(alertProps?.sx, theme) as any),
        })}
      >
        {renderToolbarAlertBannerContent?.({
          groupedAlert,
          selectedAlert,
          table,
        }) ?? (
          <>
            {alertProps?.title && <AlertTitle>{alertProps.title}</AlertTitle>}
            <Stack
              sx={{
                p:
                  positionToolbarAlertBanner !== 'head-overlay'
                    ? '0.5rem 1rem'
                    : density === 'spacious'
                      ? '0.75rem 1.25rem'
                      : density === 'comfortable'
                        ? '0.5rem 0.75rem'
                        : '0.25rem 0.5rem',
              }}
            >
              {alertProps?.children}
              {alertProps?.children && (selectedAlert || groupedAlert) && (
                <br />
              )}
              <Box sx={{ display: 'flex' }}>
                {enableRowSelection &&
                  enableSelectAll &&
                  positionToolbarAlertBanner === 'head-overlay' && (
                    <MRT_SelectCheckbox table={table} />
                  )}{' '}
                {selectedAlert}
              </Box>
              {selectedAlert && groupedAlert && <br />}
              {groupedAlert}
            </Stack>
          </>
        )}
      </Alert>
    </Collapse>
  )
}
