import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core'
import { faker } from '@faker-js/faker'
import { FlexRender, TanStackTable } from '@tanstack/angular-table'
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'
import { injectHotkeys } from '@tanstack/angular-hotkeys'
import { makeData } from './makeData'
import { createAppColumnHelper, injectTable } from './table'
import type { ElementRef } from '@angular/core'
import type { Cell } from '@tanstack/angular-table'
import type { Person } from './makeData'
import type { features } from './table'

const columnHelper = createAppColumnHelper<Person>()

// Serializing a selection for the clipboard is a userland concern: the table
// hands back `getSelectedCellRangesData()` as raw values, and the delimiter,
// the null representation, and the quoting rules are all yours to pick. This is
// the spreadsheet-flavored version.
function escapeTsvValue(value: unknown) {
  const text = value == null ? '' : String(value)
  const safeText =
    typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value)
      ? `'${text}`
      : text

  // spreadsheets expect a field to be quoted once it contains a delimiter, a
  // newline, or a quote, with inner quotes doubled
  return /["\t\n\r]/.test(safeText)
    ? `"${safeText.replace(/"/g, '""')}"`
    : safeText
}

function toTsv(ranges: Array<Array<Array<unknown>>>) {
  return ranges
    .map((grid) =>
      grid.map((row) => row.map(escapeTsvValue).join('\t')).join('\n'),
    )
    .join('\n\n') // blank line between final selected regions
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexRender, TanStackTable],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly injector = inject(Injector)
  readonly data = signal(makeData(20))
  readonly grid = viewChild<ElementRef<HTMLDivElement>>('grid')

  readonly columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: () => 'First Name',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('lastName', {
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('progress', {
      header: () => 'Profile Progress',
      // enableCellSelection: false, // this column opts out of cell selection
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('phone', {
      header: () => 'Phone',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('city', {
      header: () => 'City',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('country', {
      header: () => 'Country',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('department', {
      header: () => 'Department',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('salary', {
      header: () => 'Salary',
      cell: (info) => info.getValue().toLocaleString(),
      footer: (props) => props.column.id,
    }),
  ])

  readonly table = injectTable(() => ({
    key: 'cell-selection', // needed for devtools
    data: this.data(),
    columns: this.columns,
    getRowId: (row: Person) => row.id,
    enableCellSelection: true, // enable cell selection for all cells
    // initialState: { cellSelection: [] }, // select cells on first render
    // atoms: { cellSelection: cellSelectionAtom }, // own selection state with an external atom
    // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
    // onCellSelectionChange: (updater) => { ... },
    // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
    // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
    // enableCellSelectionDrag: false, // disable drag-to-select; default true
    // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
    debugTable: true,
  }))

  constructor() {
    // optionally, reset the cellSelection state not only when data changes, but
    // also when column order, pinning, visibility, or sorting changes
    // customize this to your needs
    let isFirstColumnLayout = true

    effect(() => {
      // read the atoms so this tracks only the layout slices
      this.table.atoms.columnOrder.get()
      this.table.atoms.columnPinning.get()
      this.table.atoms.columnVisibility.get()
      this.table.atoms.sorting.get()

      if (isFirstColumnLayout) {
        isFirstColumnLayout = false
        return
      }

      untracked(() => this.table.resetCellSelection(true))
    })

    // keyboard navigation is TanStack Hotkeys driving the table's imperative
    // APIs; table-core ships no keydown handling of its own
    injectHotkeys(
      [
        {
          hotkey: 'ArrowUp',
          callback: () => this.table.moveCellSelection('up'),
        },
        {
          hotkey: 'ArrowDown',
          callback: () => this.table.moveCellSelection('down'),
        },
        {
          hotkey: 'ArrowLeft',
          callback: () => this.table.moveCellSelection('left'),
        },
        {
          hotkey: 'ArrowRight',
          callback: () => this.table.moveCellSelection('right'),
        },
        {
          hotkey: 'Shift+ArrowUp',
          callback: () => this.table.extendCellSelection('up'),
        },
        {
          hotkey: 'Shift+ArrowDown',
          callback: () => this.table.extendCellSelection('down'),
        },
        {
          hotkey: 'Shift+ArrowLeft',
          callback: () => this.table.extendCellSelection('left'),
        },
        {
          hotkey: 'Shift+ArrowRight',
          callback: () => this.table.extendCellSelection('right'),
        },
        { hotkey: 'Mod+A', callback: () => this.table.selectAllCells() },
        {
          hotkey: 'Escape',
          callback: () => this.table.resetCellSelection(true),
        },
        { hotkey: 'Mod+C', callback: () => this.copySelection() },
      ],
      () => ({ target: this.grid()?.nativeElement ?? null }),
    )
  }

  ngOnInit() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
      injector: this.injector,
    }))
  }

  // Angular's signals keep these reads fresh, so no Subscribe workaround is
  // needed the way it is in React.
  getCellClassName(cell: Cell<typeof features, Person>) {
    // Most cells in a large grid are unselected, so bail before asking for
    // edges. getSelectionEdges() would otherwise resolve the cell's position a
    // second time just to discover it is not selected.
    if (!cell.getIsSelected()) {
      return cell.getIsFocused()
        ? 'cell-selectable cell-focused'
        : 'cell-selectable'
    }

    const edges = cell.getSelectionEdges()

    return [
      'cell-selectable',
      'cell-selected',
      cell.getIsFocused() && 'cell-focused',
      edges.top && 'cell-edge-top',
      edges.right && 'cell-edge-right',
      edges.bottom && 'cell-edge-bottom',
      edges.left && 'cell-edge-left',
    ]
      .filter(Boolean)
      .join(' ')
  }

  sortIndicator(sorted: string | false) {
    return sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
  }

  refreshData = () => this.data.set(makeData(20))
  stressTest = () => this.data.set(makeData(1_000))

  randomizeColumns() {
    this.table.setColumnOrder(
      faker.helpers.shuffle(this.table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  reverseColumns() {
    this.table.setColumnOrder(
      [...this.table.getAllLeafColumns().map((column) => column.id)].reverse(),
    )
  }

  copySelection() {
    void navigator.clipboard.writeText(
      toTsv(this.table.getSelectedCellRangesData()),
    )
  }

  logRangesData() {
    console.info(
      'table.getSelectedCellRangesData()',
      this.table.getSelectedCellRangesData(),
    )
  }

  stringifiedState() {
    return this.data().length < 1_001
      ? JSON.stringify(this.table.store.get(), null, 2)
      : ''
  }
}
