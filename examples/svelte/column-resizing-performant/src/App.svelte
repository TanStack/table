<script lang="ts">
  import {
    columnResizingFeature,
    columnSizingFeature,
    createColumnHelper,
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  /**
   * This example implements column resizing with fine-grained reactivity!
   * Svelte only re-runs the single style-attribute effect that reads the
   * derived CSS variable string, so a resize tick never re-renders anything
   */

  const features = tableFeatures({
    columnSizingFeature,
    columnResizingFeature,
  })

  const columnHelper = createColumnHelper<typeof features, Person>()

  const columns = columnHelper.columns([
    columnHelper.group({
      header: 'Name',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        }),
      ]),
    }),
    columnHelper.group({
      header: 'Info',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('visits', {
          header: () => 'Visits',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          footer: (props) => props.column.id,
        }),
      ]),
    }),
  ])

  let data = $state(makeData(200))
  const refreshData = () => {
    data = makeData(200)
  }
  const stressTest = () => {
    data = makeData(5_000)
  }

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
    defaultColumn: { minSize: 60, maxSize: 800 },
    columnResizeMode: 'onChange',
    // initialState: { columnSizing: { firstName: 200 } }, // set column sizes on first render
    // atoms: { columnResizing: columnResizingAtom }, // preferred: own transient resize state with an external atom
    // state: { columnResizing }, // classic controlled state; pair with onColumnResizingChange
    // onColumnResizingChange: setColumnResizing,
    // columnResizeDirection: 'rtl', // calculate resize offsets right-to-left; default 'ltr'
    // enableColumnResizing: false, // disable resizing for every column; default true
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  /**
   * All column widths flow through CSS variables derived in ONE string and
   * bound to the <table> element's style attribute. `header.getSize()` reads
   * the rune-backed columnSizing atom, so a resize tick re-runs only this
   * derived and its single attribute effect; header and data cells reference
   * the variables and never update.
   */
  const tableStyle = $derived.by(() => {
    const parts = ['display: grid']
    for (const header of table.getFlatHeaders()) {
      parts.push(`--header-${header.id}-size: ${header.getSize()}`)
      parts.push(`--col-${header.column.id}-size: ${header.column.getSize()}`)
    }
    parts.push(`width: ${table.getTotalSize()}px`)
    return parts.join('; ')
  })
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()} class="demo-button">
      Regenerate Data
    </button>
    <button onclick={() => stressTest()} class="demo-button">
      Stress Test (5k rows)
    </button>
  </div>
  <div class="spacer-md"></div>
  <!-- Only this text node updates per resize tick -->
  <pre style="height: 10rem; overflow: auto">
    {JSON.stringify(table.store.get(), null, 2)}
  </pre>
  <div class="spacer-md"></div>
  ({data.length.toLocaleString()} rows)
  <div class="scroll-container">
    <!-- This example is using semantic table tags, but also CSS Grid/Flexbox layout for more absolute column widths -->
    <table style={tableStyle}>
      <thead style="display: grid">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr style="display: flex; width: 100%; height: 30px">
            {#each headerGroup.headers as header (header.id)}
              <!-- use CSS variables for widths so cells never update -->
              <th
                colspan={header.colSpan}
                style="display: flex; flex-shrink: 0; width: calc(var(--header-{header.id}-size) * 1px)"
              >
                {#if !header.isPlaceholder}
                  <FlexRender {header} />
                {/if}
                <!-- This class binding is its own fine-grained effect, so a
                     drag updates exactly one resizer's class -->
                <div
                  ondblclick={() => header.column.resetSize()}
                  onmousedown={header.getResizeHandler()}
                  ontouchstart={header.getResizeHandler()}
                  aria-hidden="true"
                  class="resizer {header.column.getIsResizing()
                    ? 'isResizing'
                    : ''}"
                ></div>
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <!-- No memoization needed: nothing in the body reads resize state -->
      <tbody style="display: grid">
        {#each table.getRowModel().rows as row (row.id)}
          <!-- content-visibility lets offscreen rows skip style recalc and
               layout, so a live resize only lays out the rows on screen -->
          <tr
            style="display: flex; width: 100%; height: 30px; content-visibility: auto; contain-intrinsic-height: auto 30px"
          >
            {#each row.getAllCells() as cell (cell.id)}
              <td
                style="display: flex; flex-shrink: 0; width: calc(var(--col-{cell
                  .column.id}-size) * 1px)"
              >
                {cell.renderValue()}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
