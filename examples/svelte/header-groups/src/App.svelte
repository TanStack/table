<script lang="ts">
  import type { ColumnDef } from '@tanstack/svelte-table'
  import {
    FlexRender,
    createTable,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData, type Person } from './makeData'
  import './index.css'

  let data = $state(makeData(5))
  const refreshData = () => { data = makeData(5) }
  const stressTest = () => { data = makeData(1_000) }

  const features = tableFeatures({})

  // A traditional header group setup: every leaf column sits under a top-level
  // group, so the tree is even (2 header rows) and no placeholder headers are
  // created.
  const basicColumns: ColumnDef<typeof features, Person>[] = [
    {
      header: 'Name',
      columns: [
        {
          accessorKey: 'firstName',
          header: 'First Name',
          footer: 'First Name',
        },
        {
          accessorFn: (row) => row.lastName,
          id: 'lastName',
          header: 'Last Name',
          footer: 'Last Name',
        },
      ],
    },
    {
      header: 'Stats',
      columns: [
        { accessorKey: 'age', header: 'Age', footer: 'Age' },
        { accessorKey: 'visits', header: 'Visits', footer: 'Visits' },
      ],
    },
    {
      header: 'Profile',
      columns: [
        { accessorKey: 'status', header: 'Status', footer: 'Status' },
        {
          accessorKey: 'progress',
          header: 'Profile Progress',
          footer: 'Profile Progress',
        },
      ],
    },
  ]

  // Groups nested inside groups, with every leaf column at the same depth. The
  // tree stays even, so there are three header rows and still no placeholders,
  // and each group's colSpan is the sum of its descendants.
  const nestedColumns: ColumnDef<typeof features, Person>[] = [
    {
      header: 'Person',
      columns: [
        {
          header: 'Name',
          columns: [
            { accessorKey: 'firstName', header: 'First Name' },
            {
              accessorFn: (row) => row.lastName,
              id: 'lastName',
              header: 'Last Name',
            },
          ],
        },
        {
          header: 'Demographics',
          columns: [{ accessorKey: 'age', header: 'Age' }],
        },
      ],
    },
    {
      header: 'Activity',
      columns: [
        {
          header: 'Engagement',
          columns: [
            { accessorKey: 'visits', header: 'Visits' },
            { accessorKey: 'status', header: 'Status' },
          ],
        },
        {
          header: 'Progress',
          columns: [{ accessorKey: 'progress', header: 'Profile Progress' }],
        },
      ],
    },
  ]

  const defaultColumns: ColumnDef<typeof features, Person>[] = [
    {
      header: 'Name',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.lastName,
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        },
      ],
    },
    {
      header: 'Info',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'age',
          header: () => 'Age',
          footer: (props) => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: () => 'Visits',
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'status',
              header: 'Status',
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: 'Profile Progress',
              footer: (props) => props.column.id,
            },
          ],
        },
      ],
    },
  ]

  // An uneven column tree: `fullName` and `progress` are top-level leaf columns
  // while their siblings nest two and three levels deep. The placeholder at the
  // top of each column's placeholder chain carries the chain's full
  // `header.rowSpan`, and the headers it covers report a rowSpan of 0 so the
  // renderer can skip them.
  const unevenColumns: ColumnDef<typeof features, Person>[] = [
    {
      accessorFn: (row) =>
        [row.firstName, row.lastName].filter(Boolean).join(' '),
      id: 'fullName',
      header: 'Full Name',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Info',
      columns: [
        { accessorKey: 'age', header: () => 'Age' },
        {
          header: 'More Info',
          columns: [
            { accessorKey: 'visits', header: () => 'Visits' },
            { accessorKey: 'status', header: 'Status' },
          ],
        },
      ],
    },
    { accessorKey: 'progress', header: 'Profile Progress' },
  ]

  const tableOptions = (columns: ColumnDef<typeof features, Person>[]) => ({
    debugTable: true,
    features,
    get data() {
      return data
    },
    columns,
  })

  const basicTable = createTable(tableOptions(basicColumns))
  const nestedTable = createTable(tableOptions(nestedColumns))
  const table = createTable(tableOptions(defaultColumns))
  const unevenTable = createTable(tableOptions(unevenColumns))
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1k rows)</button>
  </div>
  <div class="spacer-md"></div>
  <!-- The panels wrap into a grid whenever the viewport is wide enough. -->
  <div class="example-grid">
    <section class="example-panel">
      <h2 class="section-title">Basic Header Groups</h2>
      <table>
        <thead>
          {#each basicTable.getHeaderGroups() as headerGroup (headerGroup.id)}
            <tr>
              {#each headerGroup.headers as header (header.id)}
                <th colSpan={header.colSpan}>
                  <FlexRender header={header} />
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each basicTable.getRowModel().rows as row (row.id)}
            <tr>
              {#each row.getAllCells() as cell (cell.id)}
                <td>
                  <FlexRender cell={cell} />
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <!-- Only the leaf columns declare footers, so skip the group row
               instead of rendering a blank one. -->
          {#each basicTable
            .getFooterGroups()
            .filter((footerGroup) => footerGroup.headers.some((header) => !header.isPlaceholder && header.column.columnDef.footer)) as footerGroup (footerGroup.id)}
            <tr>
              {#each footerGroup.headers as header (header.id)}
                <th colSpan={header.colSpan}>
                  {#if !header.isPlaceholder}
                    <FlexRender footer={header} />
                  {/if}
                </th>
              {/each}
            </tr>
          {/each}
        </tfoot>
      </table>
    </section>

    <section class="example-panel">
      <h2 class="section-title">Nested Header Groups</h2>
      <table>
        <thead>
          {#each nestedTable.getHeaderGroups() as headerGroup (headerGroup.id)}
            <tr>
              {#each headerGroup.headers as header (header.id)}
                <th colSpan={header.colSpan}>
                  <FlexRender header={header} />
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each nestedTable.getRowModel().rows as row (row.id)}
            <tr>
              {#each row.getAllCells() as cell (cell.id)}
                <td>
                  <FlexRender cell={cell} />
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>

    <section class="example-panel">
      <h2 class="section-title">Placeholder Headers</h2>
      <table>
        <thead>
          {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <tr>
              {#each headerGroup.headers as header (header.id)}
                <th colSpan={header.colSpan}>
                  {#if !header.isPlaceholder}
                    <FlexRender header={header} />
                  {/if}
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each table.getRowModel().rows as row (row.id)}
            <tr>
              {#each row.getAllCells() as cell (cell.id)}
                <td>
                  <FlexRender cell={cell} />
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
        <tfoot>
          {#each table.getFooterGroups() as footerGroup (footerGroup.id)}
            <tr>
              {#each footerGroup.headers as header (header.id)}
                <th colSpan={header.colSpan}>
                  {#if !header.isPlaceholder}
                    <FlexRender footer={header} />
                  {/if}
                </th>
              {/each}
            </tr>
          {/each}
        </tfoot>
      </table>
    </section>

    <section class="example-panel">
      <h2 class="section-title">Header Row Spanning</h2>
      <table>
        <thead>
          {#each unevenTable.getHeaderGroups() as headerGroup (headerGroup.id)}
            <tr>
              {#each headerGroup.headers as header (header.id)}
                {#if header.rowSpan !== 0}
                  <th colSpan={header.colSpan} rowSpan={header.rowSpan}>
                    <FlexRender header={header} />
                  </th>
                {/if}
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#each unevenTable.getRowModel().rows as row (row.id)}
            <tr>
              {#each row.getAllCells() as cell (cell.id)}
                <td>
                  <FlexRender cell={cell} />
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  </div>
</div>
