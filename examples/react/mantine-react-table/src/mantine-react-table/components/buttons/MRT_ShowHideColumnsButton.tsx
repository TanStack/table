import { ActionIcon,  Menu, Tooltip } from '@mantine/core'
import { MRT_ShowHideColumnsMenu } from '../menus/MRT_ShowHideColumnsMenu'
import type {ActionIconProps} from '@mantine/core';

import type {HTMLPropsRef, MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<TData extends MRT_RowData>
  extends ActionIconProps, HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>
}

export const MRT_ShowHideColumnsButton = <TData extends MRT_RowData>({
  table,
  title,
  ...rest
}: Props<TData>) => {
  const {
    icons: { IconColumns },
    localization: { showHideColumns },
  } = table.options

  return (
    <Menu closeOnItemClick={false} withinPortal>
      <Tooltip label={title ?? showHideColumns} withinPortal>
        <Menu.Target>
          <ActionIcon
            aria-label={title ?? showHideColumns}
            color="gray"
            size="lg"
            variant="subtle"
            {...rest}
          >
            <IconColumns />
          </ActionIcon>
        </Menu.Target>
      </Tooltip>
      <MRT_ShowHideColumnsMenu table={table} />
    </Menu>
  )
}
