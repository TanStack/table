# DI Tokens & Context Injection — Full Reference

`FlexRender` automatically provides DI tokens for the render context to any
component rendered through `*flexRender` / `*flexRenderCell` / etc. The renderer
inspects the props object — if it has `table`, `header`, or `cell`, it
provides the matching token in the child injector.

| Helper                                      | Returns                           | Available inside                                                                                       |
| ------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `injectFlexRenderContext<T>()`              | `T` (full props proxy)            | a component rendered via `*flexRender` / `*flexRenderCell` / `*flexRenderHeader` / `*flexRenderFooter` |
| `injectTableContext<TData>()`               | `Signal<Table<TFeatures, TData>>` | anything under `[tanStackTable]` or rendered via `*flexRender` whose context has `table`               |
| `injectTableHeaderContext<TValue, TData>()` | `Signal<Header<...>>`             | anything under `[tanStackTableHeader]` or rendered via `*flexRenderHeader`                             |
| `injectTableCellContext<TValue, TData>()`   | `Signal<Cell<...>>`               | anything under `[tanStackTableCell]` or rendered via `*flexRenderCell`                                 |

The full props passed via `*flexRender`'s `props:` (or auto-derived by the
shorthand directives) is wrapped in a `Proxy` so property access always reads
the _latest_ value across re-renders.

---

## Pattern A — inject inside the rendered component itself

If your component **is** the cell, header, or footer (rendered through
`*flexRender*`), you don't need any extra directive — the token is auto-provided.

```ts
@Component({
  template: `
    <span>{{ context.getValue() }}</span>
    <button (click)="context.row.toggleSelected()">Toggle</button>
  `,
})
export class InteractiveCell {
  readonly context = injectFlexRenderContext<CellContext<any, any, any>>()
}
```

Or, for just the cell signal:

```ts
@Component({ template: `{{ cell().getValue() }}` })
export class TextCell {
  readonly cell = injectTableCellContext<string>()
}
```

---

## Pattern B — context for _descendants outside the FlexRender tree_

When you have a component that lives next to the `*flexRenderCell` block, or
when you want any nested element to inject the table/header/cell, use the
context **host directives**:

```ts
import {
  FlexRender,
  TanStackTable,
  TanStackTableHeader,
  TanStackTableCell,
} from '@tanstack/angular-table'

@Component({
  imports: [FlexRender, TanStackTable, TanStackTableHeader, TanStackTableCell],
  templateUrl: './app.html',
})
export class App {}
```

```html
<table [tanStackTable]="table">
  @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
  <tr>
    @for (header of headerGroup.headers; track header.id) {
    <th [tanStackTableHeader]="header">
      <ng-container *flexRenderHeader="header; let value">
        {{ value }}
      </ng-container>
      <!-- Any component here can call injectTableHeaderContext() -->
    </th>
    }
  </tr>
  } @for (row of table.getRowModel().rows; track row.id) {
  <tr>
    @for (cell of row.getVisibleCells(); track cell.id) {
    <td [tanStackTableCell]="cell">
      <ng-container *flexRenderCell="cell; let value">{{ value }}</ng-container>
      <app-cell-actions />
      <!-- ↑ cell-actions calls injectTableCellContext() — no input drilling -->
    </td>
    }
  </tr>
  }
</table>
```

```ts
@Component({
  selector: 'app-cell-actions',
  template: `<button (click)="cell().row.toggleSelected()">Toggle</button>`,
})
export class CellActionsComponent {
  readonly cell = injectTableCellContext()
}
```

Each directive uses Angular's `providers` array to register a per-host factory,
so contexts are correctly scoped — multiple `[tanStackTableCell]` directives on
sibling cells provide independent values.

---

## `*flexRender` directly (custom props)

Reach for the long form `*flexRender` when:

- You're rendering something that isn't `columnDef.cell` / `header` / `footer`
  (e.g. a registered `headerComponents` member, see `createTableHook`).
- You want to override the props passed to the render function.

```html
<ng-container
  *flexRender="
    cell.column.columnDef.cell;
    props: cell.getContext();
    let rendered
  "
>
  {{ rendered }}
</ng-container>
```

Custom props (e.g. extending the default context):

```html
<ng-container
  *flexRender="
    cell.column.columnDef.cell;
    props: {
      ...cell.getContext(),
      extra: someValue(),
    };
    let rendered
  "
>
  {{ rendered }}
</ng-container>
```

Inside the rendered component, `injectFlexRenderContext()` returns this full
props object.

You can also pass `flexRenderInjector:` to override the injector used for
`createComponent`.

---

## Render-function injection context

Because column-def `cell` / `header` / `footer` functions run inside
`runInInjectionContext`, this **works** at the top of those functions:

```ts
cell: ({ getValue }) => {
  const router = inject(Router) // ✅ legal
  return router.url.endsWith('/admin') ? `[admin] ${getValue()}` : getValue()
}
```

Be deliberate: this runs every time the cell renders. For per-app values that
don't change, prefer `inject(...)` at the component level and close over.
