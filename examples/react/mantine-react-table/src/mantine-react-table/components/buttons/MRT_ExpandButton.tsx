import clsx from 'clsx'



import {
  ActionIcon,
  
  Tooltip,
  useDirection
} from '@mantine/core'

import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_EditCellTextInput } from '../inputs/MRT_EditCellTextInput'
import classes from './MRT_ExpandButton.module.css'
import type {MRT_Row, MRT_RowData, MRT_TableInstance} from '../../types';
import type {ActionIconProps} from '@mantine/core';
import type {MouseEvent} from 'react';

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_ExpandButton = <TData extends MRT_RowData>({
  row,
  table,
  ...rest
}: Props<TData>) => {
  const direction = useDirection()
  const {
    options: {
      icons: { IconChevronDown },
      localization,
      mantineExpandButtonProps,
      positionExpandColumn,
      renderDetailPanel,
    },
  } = table

  const actionIconProps = {
    ...parseFromValuesOrFunc(mantineExpandButtonProps, {
      row,
      table,
    }),
    ...rest,
  }

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <MRT_EditCellTextInput cell={cell} key={cell.id} table={table} />
    ))

  const canExpand = row.getCanExpand()
  const isExpanded = row.getIsExpanded()

  const DetailPanel = !!renderDetailPanel?.({
    internalEditComponents,
    row,
    table,
  })

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    row.toggleExpanded()
    actionIconProps?.onClick?.(event)
  }

  const rtl = direction.dir === 'rtl' || positionExpandColumn === 'last'

  return (
    <Tooltip
      disabled={!canExpand && !DetailPanel}
      label={
        actionIconProps?.title ??
        (isExpanded ? localization.collapse : localization.expand)
      }
      openDelay={1000}
      withinPortal
    >
      <ActionIcon
        aria-label={localization.expand}
        color="gray"
        disabled={!canExpand && !DetailPanel}
        variant="subtle"
        {...actionIconProps}
        __vars={{
          '--mrt-row-depth': `${row.depth}`,
        }}
        className={clsx(
          'mrt-expand-button',
          classes.root,
          classes[`root-${rtl ? 'rtl' : 'ltr'}`],
          actionIconProps?.className,
        )}
        onClick={handleToggleExpand}
        title={undefined}
      >
        {actionIconProps?.children ?? (
          <IconChevronDown
            className={clsx(
              'mrt-expand-button-chevron',
              classes.chevron,
              !canExpand && !renderDetailPanel
                ? classes.right
                : isExpanded
                  ? classes.up
                  : undefined,
            )}
          />
        )}
      </ActionIcon>
    </Tooltip>
  )
}
