import clsx from 'clsx'


import { Fragment, useMemo } from 'react'

import {
  ActionIcon,
  Alert,
  
  Badge,
  Button,
  Collapse,
  Flex,
  Stack
} from '@mantine/core'

import { getMRT_SelectAllHandler } from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_SelectCheckbox } from '../inputs/MRT_SelectCheckbox'
import classes from './MRT_ToolbarAlertBanner.module.css'
import type {MRT_RowData, MRT_TableInstance} from '../../types';
import type {AlertProps} from '@mantine/core';

interface Props<TData extends MRT_RowData> extends Partial<AlertProps> {
  stackAlertBanner?: boolean
  table: MRT_TableInstance<TData>
}

export const MRT_ToolbarAlertBanner = <TData extends MRT_RowData>({
  stackAlertBanner,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getPrePaginatedRowModel,
    state,
    options: {
      enableRowSelection,
      enableSelectAll,
      icons: { IconX },
      localization,
      mantineToolbarAlertBannerBadgeProps,
      mantineToolbarAlertBannerProps,
      manualPagination,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
  } = table
  const { density, grouping, rowSelection, showAlertBanner } = state

  const alertProps = {
    ...parseFromValuesOrFunc(mantineToolbarAlertBannerProps, {
      table,
    }),
    ...rest,
  }
  const badgeProps = parseFromValuesOrFunc(
    mantineToolbarAlertBannerBadgeProps,
    { table },
  )

  const totalRowCount = rowCount ?? getPrePaginatedRowModel().flatRows.length

  const selectedRowCount = useMemo(
    () =>
      manualPagination
        ? Object.values(rowSelection).filter(Boolean).length
        : getFilteredSelectedRowModel().rows.length,
    [rowSelection, totalRowCount, manualPagination],
  )

  const selectedAlert = selectedRowCount ? (
    <Flex align="center" gap="sm">
      {localization.selectedCountOfRowCountRowsSelected
        ?.replace('{selectedCount}', selectedRowCount.toString())
        ?.replace('{rowCount}', totalRowCount.toString())}
      <Button
        onClick={(event) =>
          getMRT_SelectAllHandler({ table })(event, false, true)
        }
        size="compact-xs"
        variant="subtle"
      >
        {localization.clearSelection}
      </Button>
    </Flex>
  ) : null

  const groupedAlert =
    grouping.length > 0 ? (
      <Flex>
        {localization.groupedBy}{' '}
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}`}>
            {index > 0 ? localization.thenBy : ''}
            <Badge
              className={classes['alert-badge']}
              rightSection={
                <ActionIcon
                  color="white"
                  onClick={() => table.getColumn(columnId).toggleGrouping()}
                  size="xs"
                  variant="subtle"
                >
                  <IconX style={{ transform: 'scale(0.8)' }} />
                </ActionIcon>
              }
              variant="filled"
              {...badgeProps}
            >
              {table.getColumn(columnId).columnDef.header}{' '}
            </Badge>
          </Fragment>
        ))}
      </Flex>
    ) : null

  return (
    <Collapse
      expanded={showAlertBanner || !!selectedAlert || !!groupedAlert}
      transitionDuration={stackAlertBanner ? 200 : 0}
    >
      <Alert
        color="blue"
        icon={false}
        {...alertProps}
        className={clsx(
          classes.alert,
          stackAlertBanner &&
            !positionToolbarAlertBanner &&
            classes['alert-stacked'],
          !stackAlertBanner &&
            positionToolbarAlertBanner === 'bottom' &&
            classes['alert-bottom'],
          alertProps?.className,
        )}
      >
        {renderToolbarAlertBannerContent?.({
          groupedAlert,
          selectedAlert,
          table,
        }) ?? (
          <Flex
            className={clsx(
              classes['toolbar-alert'],
              positionToolbarAlertBanner === 'head-overlay' &&
                classes['head-overlay'],
              density,
            )}
          >
            {enableRowSelection &&
              enableSelectAll &&
              positionToolbarAlertBanner === 'head-overlay' && (
                <MRT_SelectCheckbox table={table} />
              )}
            <Stack>
              {alertProps?.children}
              {selectedAlert}
              {groupedAlert}
            </Stack>
          </Flex>
        )}
      </Alert>
    </Collapse>
  )
}
