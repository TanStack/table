import clsx from 'clsx'


import { Flex  } from '@mantine/core'

import { MRT_ShowHideColumnsButton } from '../buttons/MRT_ShowHideColumnsButton'
import { MRT_ToggleDensePaddingButton } from '../buttons/MRT_ToggleDensePaddingButton'
import { MRT_ToggleFiltersButton } from '../buttons/MRT_ToggleFiltersButton'
import { MRT_ToggleFullScreenButton } from '../buttons/MRT_ToggleFullScreenButton'
import { MRT_ToggleGlobalFilterButton } from '../buttons/MRT_ToggleGlobalFilterButton'
import classes from './MRT_ToolbarInternalButtons.module.css'
import type {MRT_RowData, MRT_TableInstance} from '../../types';
import type {FlexProps} from '@mantine/core';

interface Props<TData extends MRT_RowData> extends FlexProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ToolbarInternalButtons = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableColumnOrdering,
      enableColumnPinning,
      enableDensityToggle,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      enableHiding,
      initialState,
      renderToolbarInternalActions,
    },
  } = table

  return (
    <Flex
      {...rest}
      className={clsx(
        'mrt-toolbar-internal-buttons',
        classes.root,
        rest?.className,
      )}
    >
      {renderToolbarInternalActions?.({ table }) ?? (
        <>
          {enableFilters &&
            enableGlobalFilter &&
            !initialState?.showGlobalFilter && (
              <MRT_ToggleGlobalFilterButton table={table} />
            )}
          {enableFilters &&
            enableColumnFilters &&
            columnFilterDisplayMode !== 'popover' && (
              <MRT_ToggleFiltersButton table={table} />
            )}
          {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
            <MRT_ShowHideColumnsButton table={table} />
          )}
          {enableDensityToggle && (
            <MRT_ToggleDensePaddingButton table={table} />
          )}
          {enableFullScreenToggle && (
            <MRT_ToggleFullScreenButton table={table} />
          )}
        </>
      )}
    </Flex>
  )
}
