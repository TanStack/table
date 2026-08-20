'use client'

import { Button, HStack, Menu, Text } from '@chakra-ui/react'
import {
  IconArrowDown,
  IconArrowUp,
  IconCategory,
  IconChevronDown,
  IconEyeOff,
  IconPinned,
} from '@tabler/icons-react'
import { useHeaderContext, useTableContext } from '@/hooks/table'
import {
  DropdownMenu,
  DropdownMenuItem,
  SortIcon,
} from '@/components/data-table/shared'

export function ColumnHeader(): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()
  const column = header.column

  const title = column.columnDef.meta?.label ?? column.id

  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const canGroup = column.getCanGroup()

  if (!canSort && !canHide && !canPin && !canGroup) {
    return <Text fontWeight="semibold">{title}</Text>
  }

  return (
    <table.Subscribe
      source={table.store}
      selector={(s: any) => ({
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
          <HStack gap={1} wrap="nowrap" width="100%">
            {canSort ? (
              <Button
                variant="plain"
                height="auto"
                minW="0"
                p="0"
                onClick={column.getToggleSortingHandler()}
                className="sort-trigger"
                style={{ flex: 1, minWidth: 0, justifyContent: 'flex-start' }}
              >
                <HStack gap={1} wrap="nowrap" minW={0}>
                  <Text fontWeight="semibold" truncate>
                    {title}
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
                </HStack>
              </Button>
            ) : (
              <Text fontWeight="semibold" truncate flex={1} minW={0}>
                {title}
              </Text>
            )}
            <DropdownMenu
              trigger={
                <Button
                  variant="subtle"
                  size="sm"
                  flexShrink={0}
                  aria-label={`Open ${title} column menu`}
                >
                  <IconChevronDown size={16} />
                </Button>
              }
            >
              {canSort ? (
                <>
                  <DropdownMenuItem
                    value={`${column.id}-sort-asc`}
                    icon={<IconArrowUp size={16} />}
                    onSelect={() => column.toggleSorting(false)}
                  >
                    Asc
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    value={`${column.id}-sort-desc`}
                    icon={<IconArrowDown size={16} />}
                    onSelect={() => column.toggleSorting(true)}
                  >
                    Desc
                  </DropdownMenuItem>
                </>
              ) : null}
              {canGroup ? (
                <DropdownMenuItem
                  value={`${column.id}-group`}
                  icon={<IconCategory size={16} />}
                  onSelect={column.getToggleGroupingHandler()}
                >
                  {grouped ? 'Ungroup' : 'Group by'}
                </DropdownMenuItem>
              ) : null}
              {canPin ? (
                <>
                  <Menu.Separator />
                  <DropdownMenuItem
                    value={`${column.id}-pin-left`}
                    disabled={pinned === 'start'}
                    icon={<IconPinned size={16} />}
                    onSelect={() => column.pin('start')}
                  >
                    Pin left
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    value={`${column.id}-pin-right`}
                    disabled={pinned === 'end'}
                    icon={<IconPinned size={16} />}
                    onSelect={() => column.pin('end')}
                  >
                    Pin right
                  </DropdownMenuItem>
                  {pinned ? (
                    <DropdownMenuItem
                      value={`${column.id}-unpin`}
                      icon={<IconPinned size={16} opacity={0.45} />}
                      onSelect={() => column.pin(false)}
                    >
                      Unpin
                    </DropdownMenuItem>
                  ) : null}
                </>
              ) : null}
              {canHide ? (
                <>
                  <Menu.Separator />
                  <DropdownMenuItem
                    value={`${column.id}-hide`}
                    icon={<IconEyeOff size={16} />}
                    onSelect={() => column.toggleVisibility(false)}
                  >
                    Hide
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenu>
          </HStack>
        )
      }}
    </table.Subscribe>
  )
}
