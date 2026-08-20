import Alpine from 'alpinejs'
import {
  FlexRender,
  columnResizingFeature,
  columnSizingFeature,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const columns: Array<ColumnDef<typeof features, Person>> = [
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
        header: () => '<span>Last Name</span>',
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
        accessorKey: 'visits',
        header: () => '<span>Visits</span>',
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
]

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(200) })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
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
    },
    () => ({}), // subscribe to nothing instead of re-evaluating every binding on every state change
  )

  let subscriptions: Array<{ unsubscribe: () => void }> = []

  return {
    table,
    FlexRender,
    local,
    init(this: { $refs: Record<string, HTMLElement> }) {
      const tableEl = this.$refs.tableEl
      const stateDump = this.$refs.stateDump

      /**
       * Instead of re-evaluating Alpine bindings on every resize tick, we
       * subscribe to the table store OUTSIDE of Alpine and write the column
       * size CSS variables directly onto the <table> element. Header and
       * data cells reference the variables, so the browser updates widths
       * with zero Alpine work per tick. (The core resize handler already
       * coalesces pointer events to one state update per animation frame.)
       */
      const writeColumnSizeVars = () => {
        for (const header of table.getFlatHeaders()) {
          tableEl.style.setProperty(
            `--header-${header.id}-size`,
            String(header.getSize()),
          )
          tableEl.style.setProperty(
            `--col-${header.column.id}-size`,
            String(header.column.getSize()),
          )
        }
        tableEl.style.width = `${table.getTotalSize()}px`
      }

      // Toggle the active resizer's highlight imperatively; a drag touches
      // exactly one element at drag start and end
      const writeResizingClass = () => {
        const resizingId = table.atoms.columnResizing.get().isResizingColumn
        tableEl
          .querySelectorAll('.resizer.isResizing')
          .forEach((el) => el.classList.remove('isResizing'))
        if (resizingId) {
          tableEl
            .querySelector(`.resizer[data-col-id="${CSS.escape(resizingId)}"]`)
            ?.classList.add('isResizing')
        }
      }

      // Only this text node updates per resize tick
      const writeStateDump = () => {
        stateDump.textContent = JSON.stringify(table.store.get(), null, 2)
      }

      writeColumnSizeVars() // initial paint
      writeStateDump()
      subscriptions = [
        table.atoms.columnSizing.subscribe(writeColumnSizeVars),
        table.atoms.columnResizing.subscribe(writeResizingClass),
        table.store.subscribe(writeStateDump),
      ]
    },
    destroy() {
      subscriptions.forEach((subscription) => subscription.unsubscribe())
      subscriptions = []
    },
    refreshData() {
      local.data = makeData(200)
    },
    stressTest() {
      local.data = makeData(5_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
