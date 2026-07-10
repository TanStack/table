import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components'
import { useHeaderContext, useTableContext } from '@/hooks/table'

function SortIcon({ direction }: { direction: 'asc' | 'desc' | undefined }) {
  if (direction === 'asc') return <span aria-hidden="true">&#x2191;</span>
  if (direction === 'desc') return <span aria-hidden="true">&#x2193;</span>
  return (
    <span aria-hidden="true" className="sort-icon-unsorted text-muted">
      &#x2195;
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
          const direction =
            sorted === 'desc' ? 'desc' : sorted === 'asc' ? 'asc' : undefined

          return (
            <>
              {canSort ? (
                <Button
                  className="header-sort-button"
                  onPress={() => column.toggleSorting()}
                >
                  <span className="truncate font-semibold">{displayTitle}</span>
                  <SortIcon direction={direction} />
                </Button>
              ) : (
                <span className="font-semibold">{displayTitle}</span>
              )}
              <MenuTrigger>
                <Button
                  className="react-aria-Button icon-button"
                  aria-label={`Open ${displayTitle} column menu`}
                >
                  &#x25BE;
                </Button>
                <Popover>
                  <Menu>
                    {canSort ? (
                      <>
                        <MenuItem
                          id="asc"
                          onAction={() => column.toggleSorting(false)}
                        >
                          Asc
                        </MenuItem>
                        <MenuItem
                          id="desc"
                          onAction={() => column.toggleSorting(true)}
                        >
                          Desc
                        </MenuItem>
                      </>
                    ) : null}
                    {canGroup ? (
                      <MenuItem
                        id="group"
                        onAction={column.getToggleGroupingHandler()}
                      >
                        {grouped ? 'Ungroup' : 'Group by'}
                      </MenuItem>
                    ) : null}
                    {canPin ? (
                      <>
                        <MenuItem
                          id="pin-left"
                          isDisabled={pinned === 'start'}
                          onAction={() => column.pin('start')}
                        >
                          Pin left
                        </MenuItem>
                        <MenuItem
                          id="pin-right"
                          isDisabled={pinned === 'end'}
                          onAction={() => column.pin('end')}
                        >
                          Pin right
                        </MenuItem>
                        {pinned ? (
                          <MenuItem
                            id="unpin"
                            onAction={() => column.pin(false)}
                          >
                            Unpin
                          </MenuItem>
                        ) : null}
                      </>
                    ) : null}
                    {canHide ? (
                      <MenuItem
                        id="hide"
                        onAction={() => column.toggleVisibility(false)}
                      >
                        Hide
                      </MenuItem>
                    ) : null}
                  </Menu>
                </Popover>
              </MenuTrigger>
            </>
          )
        }}
      </table.Subscribe>
    </div>
  )
}
