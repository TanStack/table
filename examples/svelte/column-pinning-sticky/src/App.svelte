<script lang="ts">
  import { faker } from '@faker-js/faker'
  import {
    columnOrderingFeature,
    columnPinningFeature,
    columnResizingFeature,
    columnSizingFeature,
    columnVisibilityFeature,
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Column } from '@tanstack/svelte-table'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    columnOrderingFeature,
    columnPinningFeature,
    columnResizingFeature,
    columnSizingFeature,
    columnVisibilityFeature,
  })

  type PinningStyles = {
    boxShadow: string | undefined
    left: string | undefined
    right: string | undefined
    opacity: number
    position: string
    width: string
    zIndex: number
  }

  const getCommonPinningStyles = (
    column: Column<typeof _features, Person>,
  ): PinningStyles => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right')

    return {
      boxShadow: isLastLeftPinnedColumn
        ? '-4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px gray inset'
          : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? 'sticky' : 'relative',
      width: `${column.getSize()}px`,
      zIndex: isPinned ? 1 : 0,
    }
  }

  const defaultColumns = [
    {
      accessorKey: 'firstName',
      id: 'firstName',
      header: 'First Name',
      cell: (info: any) => info.getValue(),
      footer: (props: any) => props.column.id,
      size: 180,
    },
    {
      accessorFn: (row: Person) => row.lastName,
      id: 'lastName',
      cell: (info: any) => info.getValue(),
      header: () => 'Last Name',
      footer: (props: any) => props.column.id,
      size: 180,
    },
    {
      accessorKey: 'age',
      id: 'age',
      header: 'Age',
      footer: (props: any) => props.column.id,
      size: 180,
    },
    {
      accessorKey: 'visits',
      id: 'visits',
      header: 'Visits',
      footer: (props: any) => props.column.id,
      size: 180,
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'Status',
      footer: (props: any) => props.column.id,
      size: 180,
    },
    {
      accessorKey: 'progress',
      id: 'progress',
      header: 'Profile Progress',
      footer: (props: any) => props.column.id,
      size: 180,
    },
  ]

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(100_000) }

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns: defaultColumns,
      get data() {
        return data
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
      columnResizeMode: 'onChange',
    },
    (state) => state,
  )

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }
</script>

<div class="p-2">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <div class="inline-block border border-black shadow rounded">
    <div class="px-1 border-b border-black">
      <label>
        <input
          type="checkbox"
          checked={table.getIsAllColumnsVisible()}
          onchange={table.getToggleAllColumnsVisibilityHandler()}
        />
        {' '}Toggle All
      </label>
    </div>
    {#each table.getAllLeafColumns() as column}
      <div class="px-1">
        <label>
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onchange={column.getToggleVisibilityHandler()}
          />
          {' '}{column.id}
        </label>
      </div>
    {/each}
  </div>
  <div class="h-4"></div>
  <div class="flex flex-wrap gap-2">
    <button onclick={() => refreshData()} class="border p-1">
      Regenerate Data
    </button>
    <button onclick={() => stressTest()} class="border p-1">
      Stress Test (100k rows)
    </button>
    <button onclick={() => randomizeColumns()} class="border p-1">
      Shuffle Columns
    </button>
  </div>
  <div class="h-4"></div>
  <div class="table-container">
    <table style="width: {table.getTotalSize()}px">
      <thead>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as header (header.id)}
              {@const styles = getCommonPinningStyles(header.column)}
              <th
                colSpan={header.colSpan}
                style="box-shadow: {styles.boxShadow ?? 'none'}; left: {styles.left ?? 'auto'}; right: {styles.right ?? 'auto'}; opacity: {styles.opacity}; position: {styles.position}; width: {styles.width}; z-index: {styles.zIndex}"
              >
                <div class="whitespace-nowrap">
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                    {' '}
                  {/if}
                  {header.column.getIndex(header.column.getIsPinned() || 'center')}
                </div>
                {#if !header.isPlaceholder && header.column.getCanPin()}
                  <div class="flex gap-1 justify-center">
                    {#if header.column.getIsPinned() !== 'left'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('left')}
                      >
                        {'<='}
                      </button>
                    {/if}
                    {#if header.column.getIsPinned()}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin(false)}
                      >
                        X
                      </button>
                    {/if}
                    {#if header.column.getIsPinned() !== 'right'}
                      <button
                        class="border rounded px-2"
                        onclick={() => header.column.pin('right')}
                      >
                        {'=>'}
                      </button>
                    {/if}
                  </div>
                {/if}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  ondblclick={() => header.column.resetSize()}
                  onmousedown={header.getResizeHandler()}
                  ontouchstart={header.getResizeHandler()}
                  class="resizer {header.column.getIsResizing() ? 'isResizing' : ''}"
                ></div>
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getRowModel().rows as row (row.id)}
          <tr>
            {#each row.getVisibleCells() as cell (cell.id)}
              {@const styles = getCommonPinningStyles(cell.column)}
              <td
                style="box-shadow: {styles.boxShadow ?? 'none'}; left: {styles.left ?? 'auto'}; right: {styles.right ?? 'auto'}; opacity: {styles.opacity}; position: {styles.position}; width: {styles.width}; z-index: {styles.zIndex}"
              >
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>
