---
name: angular/angular-rendering-directives
description: >
  Angular's structural-directive rendering pipeline for TanStack Table v9. Covers `FlexRender`
  (`*flexRender`), the shorthand directives `*flexRenderCell` / `*flexRenderHeader` /
  `*flexRenderFooter`, the `flexRenderComponent(Component, { inputs, outputs, bindings, directives, injector })`
  wrapper, DI tokens `TanStackTableToken` / `TanStackTableHeaderToken` / `TanStackTableCellToken`
  with their `injectTableContext()` / `injectTableHeaderContext()` / `injectTableCellContext()`
  helpers, the `[tanStackTable]` / `[tanStackTableHeader]` / `[tanStackTableCell]` host directives,
  `injectFlexRenderContext()`, automatic token injection inside `*flexRender`, and the four
  content shapes (primitive, `TemplateRef`, component type, `flexRenderComponent` wrapper).
type: framework
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - column-definitions
sources:
  - TanStack/table:docs/framework/angular/guide/rendering.md
  - TanStack/table:packages/angular-table/src/flexRender.ts
  - TanStack/table:packages/angular-table/src/helpers/flexRenderCell.ts
  - TanStack/table:packages/angular-table/src/helpers/cell.ts
  - TanStack/table:packages/angular-table/src/helpers/header.ts
  - TanStack/table:packages/angular-table/src/helpers/table.ts
  - TanStack/table:packages/angular-table/src/flex-render/flexRenderComponent.ts
  - TanStack/table:packages/angular-table/src/flex-render/context.ts
  - TanStack/table:packages/angular-table/src/flex-render/renderer.ts
  - TanStack/table:examples/angular/basic-inject-table/
  - TanStack/table:examples/angular/editable/
  - TanStack/table:examples/angular/row-selection-signal/
  - TanStack/table:examples/angular/composable-tables/
---

# Angular Rendering Directives (v9)

> **This skill is Angular-only.** Agents trained on React/Vue copy the wrong
> pattern here — there is no `flexRender(cell.column.columnDef.cell, cell.getContext())`
> call expression in Angular. Rendering is **structural-directive based**:
> `*flexRender`, `*flexRenderCell`, `*flexRenderHeader`, `*flexRenderFooter`.
>
> Read `tanstack-table/angular/table-state` first.

---

## 1. Setup: the single import — `FlexRender`

`FlexRender` is exported as a _tuple_ of two directives so a single import gets
you everything:

```ts
import { FlexRender } from '@tanstack/angular-table'

@Component({
  imports: [FlexRender], // imports BOTH FlexRenderDirective + FlexRenderCell
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
```

`FlexRender` ≡ `[FlexRenderDirective, FlexRenderCell] as const`. Prefer this over
importing the individual directives — it survives future additions.

Tokens / context directives (`TanStackTable`, `TanStackTableHeader`,
`TanStackTableCell`) are separate imports — add them only when you use them.

---

## 2. The shorthand directives — your default

For standard header / cell / footer rendering, **prefer the shorthand directives**.
They resolve `columnDef.cell` / `columnDef.header` / `columnDef.footer` and the
right context for you, so you don't write `props:` by hand.

| Directive                               | Input    | Resolves                                   |
| --------------------------------------- | -------- | ------------------------------------------ |
| `*flexRenderCell="cell; let value"`     | `Cell`   | `columnDef.cell` + `cell.getContext()`     |
| `*flexRenderHeader="header; let value"` | `Header` | `columnDef.header` + `header.getContext()` |
| `*flexRenderFooter="footer; let value"` | `Header` | `columnDef.footer` + `header.getContext()` |

```html
<table>
  <thead>
    @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
    <tr>
      @for (header of headerGroup.headers; track header.id) {
      <th>
        @if (!header.isPlaceholder) {
        <ng-container *flexRenderHeader="header; let value">
          {{ value }}
        </ng-container>
        }
      </th>
      }
    </tr>
    }
  </thead>

  <tbody>
    @for (row of table.getRowModel().rows; track row.id) {
    <tr>
      @for (cell of row.getVisibleCells(); track cell.id) {
      <td>
        <ng-container *flexRenderCell="cell; let value">
          {{ value }}
        </ng-container>
      </td>
      }
    </tr>
    }
  </tbody>

  <tfoot>
    @for (footerGroup of table.getFooterGroups(); track footerGroup.id) {
    <tr>
      @for (footer of footerGroup.headers; track footer.id) {
      <th *flexRenderFooter="footer; let value">{{ value }}</th>
      }
    </tr>
    }
  </tfoot>
</table>
```

The shorthand selector matches on `ng-template[flexRenderCell]`, so applying it
to a `<td>` host (`<td *flexRenderCell="cell; let value">`) desugars to an
`<ng-template>` Angular renders inside the `<td>`. Both forms are valid.

---

## 3. The four content shapes a column def can produce

`columnDef.cell` / `header` / `footer` can return any of these — `FlexRender`
dispatches on the shape:

| Returned value                                          | Renderer behavior                                                                                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Primitive** (`string`, `number`, `null`, `undefined`) | implicit `$implicit` value via `createEmbeddedView`.                                             |
| **`TemplateRef`**                                       | render context passed as `$implicit`.                                                            |
| **Component type** (`Type<T>`)                          | `createComponent`; context properties forwarded via `setInput(...)` to matching `input()` slots. |
| **`flexRenderComponent(Component, options)`**           | `createComponent` with explicit `inputs`, `outputs`, `bindings`, `directives`, `injector`.       |

Render functions run inside `runInInjectionContext`, so you can call `inject()`,
read signals, and access DI tokens from within `cell: () => …`.

See [`references/content-shapes.md`](references/content-shapes.md) for full
worked examples of each shape (primitives, `TemplateRef` via `viewChild`,
returning component classes with `input()` slots).

---

## 4. The primitive cell pattern

The 90% case — return a value, render it.

```ts
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: (info) => info.getValue(),
  },
]
```

```html
<td *flexRenderCell="cell; let value">{{ value }}</td>
```

---

## 5. Component cells: pass-through vs `flexRenderComponent`

### Pass-through — return the component class

```ts
@Component({
  selector: 'app-select-all',
  template: `
    <input
      type="checkbox"
      [checked]="table().getIsAllRowsSelected()"
      (change)="table().toggleAllRowsSelected()"
    />
  `,
})
export class SelectAllComponent<T> {
  readonly table = input.required<Table<any, T>>()
}

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'select',
    header: () => SelectAllComponent,
    cell: () => RowSelectComponent,
  },
]
```

The renderer calls `setInput(name, value)` for every property on the render
context — declare `input()` / `input.required()` for the names you need.

### `flexRenderComponent(Component, options)` — explicit wiring

Reach for the wrapper when you need custom inputs not on the context, output
callbacks, a custom injector, or Angular v20+ `bindings` / `directives`:

```ts
import { flexRenderComponent } from '@tanstack/angular-table'

cell: ({ getValue, row, column, table }) =>
  flexRenderComponent(EditableCell, {
    inputs: { value: getValue() },
    outputs: {
      change: (value) =>
        table.options.meta?.updateData(row.index, column.id, value),
    },
  })
```

Full option semantics (how `inputs` diff, how `outputs` resolve `OutputEmitterRef`,
when to use `bindings` vs `inputs`, and the v20+ `inputBinding` / `twoWayBinding`
API) → [`references/flex-render-component-options.md`](references/flex-render-component-options.md).

---

## 6. DI tokens & context injection — the prop-drill killer

`FlexRender` automatically provides DI tokens for the render context to any
component rendered through `*flexRender` / `*flexRenderCell` / etc. The renderer
inspects the props object — if it has `table`, `header`, or `cell`, it
provides the matching token in the child injector.

| Helper                                      | Returns                           |
| ------------------------------------------- | --------------------------------- |
| `injectFlexRenderContext<T>()`              | `T` (full props proxy)            |
| `injectTableContext<TData>()`               | `Signal<Table<TFeatures, TData>>` |
| `injectTableHeaderContext<TValue, TData>()` | `Signal<Header<...>>`             |
| `injectTableCellContext<TValue, TData>()`   | `Signal<Cell<...>>`               |

### Pattern A — inside the rendered component itself (auto-provided)

```ts
@Component({ template: `{{ cell().getValue() }}` })
export class TextCell {
  readonly cell = injectTableCellContext<string>()
}
```

### Pattern B — for descendants outside the FlexRender tree

Apply `[tanStackTable]`, `[tanStackTableHeader]`, or `[tanStackTableCell]` on
the host element to make the token available to children that aren't rendered
through `*flexRender*`:

```html
<td [tanStackTableCell]="cell">
  <ng-container *flexRenderCell="cell; let value">{{ value }}</ng-container>
  <app-cell-actions />
  <!-- ↑ calls injectTableCellContext() — no input drilling -->
</td>
```

Full directive shapes, scoping rules, `*flexRender` long-form, custom
`flexRenderInjector:`, and `runInInjectionContext` behavior in column defs →
[`references/di-tokens.md`](references/di-tokens.md).

---

## 7. The `track` value matters

Angular `@for` requires `track` and TanStack Table gives you stable IDs. Use
them:

```html
@for (headerGroup of table.getHeaderGroups(); track headerGroup.id) { ... } @for
(header of headerGroup.headers; track header.id) { ... } @for (row of
table.getRowModel().rows; track row.id) { ... } @for (cell of
row.getVisibleCells(); track cell.id) { ... } @for (footerGroup of
table.getFooterGroups(); track footerGroup.id) { ... }
```

`row.id` defaults to row index; provide `getRowId: (row) => row.id` in your
table options when you have a stable primary key (required for stable row
selection across re-fetches, see `compose-with-tanstack-query`).

---

## 8. `createTableHook` — registering components for whole-app use

`createTableHook(...)` accepts three optional component registries
(`tableComponents`, `cellComponents`, `headerComponents`) that become
type-safe members on `table.<Name>`, `cell.<Name>`, `header.<Name>`. Use them
to standardize cell/header/control components across an app while keeping
column defs short and typed.

```ts
export const { injectAppTable, createAppColumnHelper } = createTableHook({
  features: tableFeatures({
    rowSortingFeature,
    /* row-model factories and fn registries also go here */
  }),
  tableComponents: { PaginationControls, RowCount },
  cellComponents: { TextCell, NumberCell, StatusCell },
  headerComponents: { SortIndicator, ColumnFilter },
})
```

Full registry semantics, `table.appCell(cell)` / `table.appHeader(header)`
narrowing, `NgComponentOutlet` usage, and worked examples →
[`references/create-table-hook-registries.md`](references/create-table-hook-registries.md).

---

## Failure modes

### 1. (CRITICAL) Copying React/Vue's `flexRender(fn, ctx)` call into Angular

```ts
// ❌ This is the React/Vue pattern — no such call expression exists in Angular
{{ flexRender(cell.column.columnDef.cell, cell.getContext()) }}

// ✅ Angular is directive-based
<td *flexRenderCell="cell; let value">{{ value }}</td>
```

If an agent imports `flexRender` as a function from `@tanstack/angular-table`,
they've crossed wires. `FlexRender` in Angular is a **directive tuple constant**
used in `imports: [FlexRender]`.

### 2. (CRITICAL) Returning a component without `input()` slots

```ts
@Component({ template: `{{ row.original.firstName }}` })
export class NameCell {
  row: any
} // ❌ no input() — `row` is never set
```

The renderer calls `setInput('row', cell.row)`. Without `row = input<Row<any, any>>()`,
the property stays `undefined`. Either:

- declare `input()` / `input.required()` for the context properties you need, or
- use `injectFlexRenderContext()` / `injectTableCellContext()` for the full
  proxy.

### 3. (CRITICAL) Reaching for `flexRenderComponent` for plain pass-through

If you don't need custom inputs/outputs/bindings/injector, **return the
component class directly** and let the renderer wire context inputs. Reserve
`flexRenderComponent(...)` for the cases that need explicit options.

```ts
// Plain pass-through — no wrapper needed
cell: () => TextCellComponent

// Wrapper needed — custom inputs/outputs
cell: ({ getValue }) =>
  flexRenderComponent(EditableCell, {
    inputs: { value: getValue() },
    outputs: { change: (v) => {} },
  })
```

### 4. (HIGH) Mixing `flexRenderComponent`'s `bindings` with `inputs` / `outputs`

`bindings` apply at component creation; `inputs`/`outputs` apply imperatively
after. Mixing them on the same property double-initializes the input or
conflicts the output. Pick one mechanism per component.

### 5. (HIGH) Forgetting `@if (!header.isPlaceholder)` for grouped/spanned headers

Grouped column defs produce placeholder headers in some header rows. Rendering
their `header` definition there is wrong. Always guard:

```html
@if (!header.isPlaceholder) {
<ng-container *flexRenderHeader="header; let value">{{ value }}</ng-container>
}
```

### 6. (MEDIUM) Drilling cell/header inputs through layers of wrapper components

The whole point of `[tanStackTableCell]` / `[tanStackTableHeader]` / `[tanStackTable]`
plus the inject helpers is to **stop input drilling**. If you find yourself
passing `cell` (or any context) through 3 component layers, replace it with
`injectTableCellContext()` at the leaf.

### 7. (MEDIUM) Assuming `injectTableCellContext()` works outside the FlexRender tree without the directive

The token is provided automatically inside `*flexRenderCell` / `*flexRender`
(when context has `cell`). For a sibling component in the same `<td>` that is
**not** rendered through `*flexRender*`, you must apply `[tanStackTableCell]="cell"`
on the host to make the token available. Same rule for header and table.

---

## References

- [Full content shape reference (primitive / TemplateRef / component class)](references/content-shapes.md)
- [`flexRenderComponent` options reference (inputs/outputs/bindings/injector)](references/flex-render-component-options.md)
- [DI tokens & host directives — patterns A & B, `*flexRender` long-form](references/di-tokens.md)
- [`createTableHook` component registries (table/cell/header)](references/create-table-hook-registries.md)

---

## See also

- `tanstack-table/angular/table-state` — state model & `injectTable`
- `tanstack-table/angular/getting-started` — end-to-end first table
- `tanstack-table/core/column-definitions` — `cell` / `header` / `footer`
  function signatures (framework-agnostic)
- `tanstack-table/angular/migrate-v8-to-v9` — `FlexRenderDirective` →
  `*flexRender` shorthand evolution
