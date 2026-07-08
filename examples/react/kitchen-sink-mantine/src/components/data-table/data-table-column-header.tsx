'use client'

import { ActionIcon, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import {
  IconArrowDown,
  IconArrowUp,
  IconCategory,
  IconChevronDown,
  IconEyeOff,
  IconPinned,
} from '@tabler/icons-react'
import { Subscribe } from '@tanstack/react-table'
import { useHeaderContext, useTableContext } from '@/hooks/table'
import { SortIcon } from '@/components/data-table/shared'

export function ColumnHeader({ title }: { title?: string }): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()
  const column = header.column

  const displayTitle = column.columnDef.meta?.label ?? title ?? column.id

  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const canGroup = column.getCanGroup()

  if (!canSort && !canHide && !canPin && !canGroup) {
    return <Text fw={600}>{displayTitle}</Text>
  }

  return (
    <Subscribe
      source={table.store}
      selector={(s) => ({
        sorting: s.sorting,
        grouping: s.grouping,
        columnPinning: s.columnPinning,
      })}
    >
      {() => {
        const sorted = canSort ? column.getIsSorted() : false
        const pinned = canPin ? column.getIsPinned() : false
        const grouped = canGroup ? column.getIsGrouped() : false

        return (
          <Group gap={4} wrap="nowrap">
            {canSort ? (
              <UnstyledButton
                onClick={column.getToggleSortingHandler()}
                className="sort-trigger"
                style={{ minWidth: 0 }}
              >
                <Group gap={4} wrap="nowrap">
                  <Text fw={600} truncate>
                    {displayTitle}
                  </Text>
                  <SortIcon
                    direction={
                      sorted === 'asc'
                        ? 'asc'
                        : sorted === 'desc'
                          ? 'desc'
                          : undefined
                    }
                  />
                </Group>
              </UnstyledButton>
            ) : (
              <Text fw={600}>{displayTitle}</Text>
            )}
            <Menu shadow="md" width={180}>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  aria-label={`Open ${displayTitle} column menu`}
                >
                  <IconChevronDown size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {canSort ? (
                  <>
                    <Menu.Item
                      leftSection={<IconArrowUp size={16} />}
                      onClick={() => column.toggleSorting(false)}
                    >
                      Asc
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconArrowDown size={16} />}
                      onClick={() => column.toggleSorting(true)}
                    >
                      Desc
                    </Menu.Item>
                  </>
                ) : null}
                {canGroup ? (
                  <Menu.Item
                    leftSection={<IconCategory size={16} />}
                    onClick={column.getToggleGroupingHandler()}
                  >
                    {grouped ? 'Ungroup' : 'Group by'}
                  </Menu.Item>
                ) : null}
                {canPin ? (
                  <>
                    <Menu.Divider />
                    <Menu.Item
                      disabled={pinned === 'left'}
                      leftSection={<IconPinned size={16} />}
                      onClick={() => column.pin('left')}
                    >
                      Pin left
                    </Menu.Item>
                    <Menu.Item
                      disabled={pinned === 'right'}
                      leftSection={<IconPinned size={16} />}
                      onClick={() => column.pin('right')}
                    >
                      Pin right
                    </Menu.Item>
                    {pinned ? (
                      <Menu.Item
                        leftSection={<IconPinned size={16} opacity={0.45} />}
                        onClick={() => column.pin(false)}
                      >
                        Unpin
                      </Menu.Item>
                    ) : null}
                  </>
                ) : null}
                {canHide ? (
                  <>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<IconEyeOff size={16} />}
                      onClick={() => column.toggleVisibility(false)}
                    >
                      Hide
                    </Menu.Item>
                  </>
                ) : null}
              </Menu.Dropdown>
            </Menu>
          </Group>
        )
      }}
    </Subscribe>
  )
}
