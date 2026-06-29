# `createTableHook` — Component Registries Reference

`createTableHook(...)` returns Angular helpers with three optional component
registries:

| Registry           | Lives on                                                                          | Inject inside it with                                       |
| ------------------ | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `tableComponents`  | `table.<ComponentName>` (the table object)                                        | `injectTableContext()`                                      |
| `cellComponents`   | the `Cell` prototype (`cell.<ComponentName>` after `table.appCell(cell)`)         | `injectTableCellContext()` (or `injectFlexRenderContext()`) |
| `headerComponents` | the `Header` prototype (`header.<ComponentName>` after `table.appHeader(header)`) | `injectTableHeaderContext()`                                |

```ts
import {
  createTableHook,
  tableFeatures,
  rowSortingFeature,
} from '@tanstack/angular-table'
import { PaginationControls, RowCount } from './components/table-components'
import { TextCell, NumberCell, StatusCell } from './components/cell-components'
import { SortIndicator, ColumnFilter } from './components/header-components'

export const {
  injectAppTable,
  createAppColumnHelper,
  injectTableContext,
  injectTableCellContext,
  injectTableHeaderContext,
} = createTableHook({
  features: tableFeatures({
    rowSortingFeature,
    /* row-model factories and fn registries also go here */
  }),
  tableComponents: { PaginationControls, RowCount },
  cellComponents: { TextCell, NumberCell, StatusCell },
  headerComponents: { SortIndicator, ColumnFilter },
})
```

Use `NgComponentOutlet` to render table components:

```html
<ng-container *ngComponentOutlet="table.PaginationControls" />
<ng-container *ngComponentOutlet="table.RowCount" />
```

Reference cell components from column defs (type-safe through
`createAppColumnHelper<Person>()`):

```ts
const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: ({ cell }) => cell.TextCell, // ✅ TS autocompletes registered components
  }),
  columnHelper.accessor('age', {
    cell: ({ cell }) => cell.NumberCell,
  }),
])
```

Headers via `table.appHeader(header)`:

```html
@for (_h of headerGroup.headers; track _h.id) { @let header =
table.appHeader(_h);
<th>
  <ng-container *flexRenderHeader="header; let value">
    {{ value }}
  </ng-container>
  <ng-container
    *flexRender="header.SortIndicator; props: header.getContext(); let v"
  >
    <div [innerHTML]="v"></div>
  </ng-container>
</th>
}
```

A header component is just an injection-context function or component:

```ts
export function SortIndicator(): string | null {
  const header = injectTableHeaderContext()
  const sorted = header().column.getIsSorted()
  if (!sorted) return null
  return sorted === 'asc' ? '🔼' : '🔽'
}
```
