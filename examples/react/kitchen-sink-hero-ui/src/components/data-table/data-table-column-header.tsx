'use client'

import { Button, Dropdown } from '@heroui/react'
import { useHeaderContext, useTableContext } from '@/hooks/table'

function SortIcon({ direction }: { direction: 'asc' | 'desc' | undefined }) {
  if (direction === 'asc') return <span aria-hidden="true">{'↑'}</span>
  if (direction === 'desc') return <span aria-hidden="true">{'↓'}</span>
  return (
    <span
      aria-hidden="true"
      className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
    >
      {'↕'}
    </span>
  )
}

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
    return <span className="font-semibold">{displayTitle}</span>
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <table.Subscribe
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
          const direction =
            sorted === 'asc' ? 'asc' : sorted === 'desc' ? 'desc' : undefined

          return (
            <>
              {canSort ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="group min-w-0 px-1"
                  onPress={() => column.toggleSorting()}
                >
                  <span className="truncate font-semibold">{displayTitle}</span>
                  <SortIcon direction={direction} />
                </Button>
              ) : (
                <span className="font-semibold">{displayTitle}</span>
              )}
              <Dropdown>
                <Dropdown.Trigger
                  aria-label={`Open ${displayTitle} column menu`}
                >
                  {'▾'}
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <Dropdown.Menu>
                    {canSort ? (
                      <>
                        <Dropdown.Item
                          id="asc"
                          onAction={() => column.toggleSorting(false)}
                        >
                          Asc
                        </Dropdown.Item>
                        <Dropdown.Item
                          id="desc"
                          onAction={() => column.toggleSorting(true)}
                        >
                          Desc
                        </Dropdown.Item>
                      </>
                    ) : null}
                    {canGroup ? (
                      <Dropdown.Item
                        id="group"
                        onAction={column.getToggleGroupingHandler()}
                      >
                        {grouped ? 'Ungroup' : 'Group by'}
                      </Dropdown.Item>
                    ) : null}
                    {canPin ? (
                      <>
                        <Dropdown.Item
                          id="pin-left"
                          isDisabled={pinned === 'start'}
                          onAction={() => column.pin('start')}
                        >
                          Pin left
                        </Dropdown.Item>
                        <Dropdown.Item
                          id="pin-right"
                          isDisabled={pinned === 'end'}
                          onAction={() => column.pin('end')}
                        >
                          Pin right
                        </Dropdown.Item>
                        {pinned ? (
                          <Dropdown.Item
                            id="unpin"
                            onAction={() => column.pin(false)}
                          >
                            Unpin
                          </Dropdown.Item>
                        ) : null}
                      </>
                    ) : null}
                    {canHide ? (
                      <Dropdown.Item
                        id="hide"
                        onAction={() => column.toggleVisibility(false)}
                      >
                        Hide
                      </Dropdown.Item>
                    ) : null}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </>
          )
        }}
      </table.Subscribe>
    </div>
  )
}
