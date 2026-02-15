---
title: Rendering components
---

The `@tanstack/angular-table` adapter provides structural directives and dependency injection primitives for rendering table content in Angular templates.

## FlexRender

[`FlexRender`](../reference/variables/FlexRender) is the rendering primitive.
It is exported as a tuple of two directives:

- [`FlexRenderDirective`](../reference/classes/FlexRenderDirective) — the base structural directive (`*flexRender`)
- [`FlexRenderCell`](../reference/classes/FlexRenderCell.md) — shorthand directives (`*flexRenderCell`, `*flexRenderHeader`, `*flexRenderFooter`)

Import `FlexRender` to get both:

```ts
import { Component } from '@angular/core'
import { FlexRender } from '@tanstack/angular-table'

@Component({
  imports: [FlexRender],
  templateUrl: './app.html',
})
export class AppComponent {}
```

### How it works

`FlexRender` is an Angular **structural directive**. Internally, it resolves the column definition's `header`, `cell`, or `footer` function and renders the result using [`ViewContainerRef`](https://angular.dev/api/core/ViewContainerRef):

- **Primitives** (`string`, `number`): rendered via `createEmbeddedView` into the host `ng-template`. The value is exposed as the template's implicit context (`let value`).
- **`TemplateRef`**: rendered via `createEmbeddedView`. The render context (`CellContext`, `HeaderContext`) is passed as `$implicit`.
- **`flexRenderComponent(...)`**: rendered via `createComponent` with explicit `inputs`, `outputs`, `bindings`, `directives`, and `injector`.
- **Component type** (`Type<T>`): rendered via [`createComponent`](https://angular.dev/api/core/ViewContainerRef#createComponent). All properties from the render context are set as component inputs through [`ComponentRef.setInput`](https://angular.dev/api/core/ComponentRef#setInput).

Column definition functions (`header`, `cell`, `footer`) are called inside [`runInInjectionContext`](https://angular.dev/api/core/runInInjectionContext), which means you can call `inject()`, use signals, and access DI tokens directly in your render logic.

## Cell rendering

Prefer the shorthand directives for standard rendering:

| Directive | Input | Column definition |
|---|---|---|
| `*flexRenderCell` | `Cell` | `columnDef.cell` |
| `*flexRenderHeader` | `Header` | `columnDef.header` |
| `*flexRenderFooter` | `Header` | `columnDef.footer` |

Each shorthand resolves the correct column definition function and render context automatically through a `computed` signal, so no manual `props` mapping is needed.

### Example

```html
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
```

## Cell rendering with custom props

When you need full control over the `props` passed to the render function, use `*flexRender` directly.

`FlexRenderDirective` accepts two inputs:

- `flexRender` — the render definition (a column def function, a string, a `TemplateRef`, a component type, or a `flexRenderComponent(...)` wrapper)
- `flexRenderProps` — the props object passed to the render function and used as the implicit template context

Standard usage:

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

You can pass a custom props object to override the default context shape:

```html
<ng-container
  *flexRender="
    cell.column.columnDef.cell;
    props: {
      value: cell.getValue(),
      ...cell.getContext(),
    };
    let rendered
  "
>
  {{ rendered }}
</ng-container>
```

Inside rendered components, the full props object is available via [`injectFlexRenderContext()`](#injectflexrendercontext).

## Component rendering

You can render Angular components from column definitions in two ways:

### Using `flexRenderComponent`

[`flexRenderComponent(component, options?)`](../reference/functions/flexRenderComponent) wraps a component type with explicit options for `inputs`, `outputs`, `injector`, `bindings`, and `directives`.

Use this when you need to:

- pass custom inputs not derived from the render context
- subscribe to component outputs
- provide a custom `Injector`
- use creation-time `bindings` (Angular v20+)
- apply host directives and binding values at runtime

```ts
import { flexRenderComponent, type ColumnDef } from '@tanstack/angular-table'

const columns: ColumnDef<Person>[] = [
  {
    id: 'custom-cell',
    cell: ctx =>
      flexRenderComponent(CustomCellComponent, {
        inputs: {
          content: ctx.row.original.firstName,
        },
        outputs: {
          clicked: value => {
            console.log(value)
          },
        },
      }),
  },
]
```

#### How inputs and outputs work

**Inputs** are applied through [`ComponentRef.setInput(key, value)`](https://angular.dev/api/core/ComponentRef#setInput). This works with both `input()` signals and `@Input()` decorators. Inputs are diffed on every change detection cycle using `KeyValueDiffers` — only changed values trigger `setInput`.

For object-like inputs, updates are reference-based: if the object reference is stable, Angular's default input equality semantics prevent unnecessary updates.

**Outputs** work through `OutputEmitterRef` subscriptions. The factory reads the component instance property by name, checks that it is an `OutputEmitterRef`, and subscribes to it. When the output emits, the corresponding callback from `outputs` is invoked. Subscriptions are cleaned up automatically when the component is destroyed.

#### `bindings` API (Angular v20+)

`flexRenderComponent` also accepts `bindings` and `directives`, forwarded directly to [`ViewContainerRef.createComponent`](https://angular.dev/api/core/ViewContainerRef#createComponent) at creation time.

This supports Angular programmatic rendering APIs for passing host directives and binding values at runtime.

Unlike `inputs`/`outputs` (which are applied imperatively after creation), `bindings` are applied **at creation time** — they participate in the component's initial change detection cycle.

```ts
import {
  inputBinding,
  outputBinding,
  twoWayBinding,
  signal,
} from '@angular/core'
import { flexRenderComponent } from '@tanstack/angular-table'

readonly name = signal('Ada')

cell: () =>
  flexRenderComponent(EditableNameCellComponent, {
    bindings: [
      inputBinding('value', this.name),
      outputBinding('valueChange', value => {
        console.log('changed', value)
      }),
      twoWayBinding('value', this.name),
    ],
  })
```

> Avoid mixing `bindings` with `inputs`/`outputs` on the same property. `bindings` are applied at creation, while `inputs`/`outputs` are applied post-creation — mixing them can lead to double initialization or conflicting values.

See the Angular docs for details:

- [Programmatic rendering — Binding inputs/outputs/directives](https://angular.dev/guide/components/programmatic-rendering#binding-inputs-outputs-and-setting-host-directives-at-creation)
- [`inputBinding`](https://angular.dev/api/core/inputBinding), [`outputBinding`](https://angular.dev/api/core/outputBinding), [`twoWayBinding`](https://angular.dev/api/core/twoWayBinding)

### Returning a component class

Return a component class from `header`, `cell`, or `footer`. 

The render context properties (`table`, `column`, `header`, `cell`, `row`, `getValue`, etc.) are automatically set as component inputs via `ComponentRef.setInput(...)`.

Define input signals matching the context property names you need:

```ts
import { Component, input } from '@angular/core'
import type { ColumnDef, Table, CellContext } from '@tanstack/angular-table'

const columns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: () => TableHeadSelectionComponent,
    cell: () => TableRowSelectionComponent,
  },
]

@Component({
  template: `
    <input
      type="checkbox"
      [checked]="table().getIsAllRowsSelected()"
      [indeterminate]="table().getIsSomeRowsSelected()"
      (change)="table().toggleAllRowsSelected()"
    />
  `,
})
export class TableHeadSelectionComponent<T> {
  readonly table = input.required<Table<T>>();
  // column = input.required<Column<typeof _features, T, unknown>>()
  // header = input.required<Header<typeof _features, T, unknown>>()
}
```

Only properties declared with `input()` / `input.required()` are set — other context properties are silently ignored. You can also access the full context via [`injectFlexRenderContext()`](#injectflexrendercontext).

## TemplateRef rendering

You can return a `TemplateRef` from column definitions. The render context is passed as the template's `$implicit` context.

Use `viewChild(...)` to capture template references:

```ts
import { Component, TemplateRef, viewChild } from '@angular/core'
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from '@tanstack/angular-table'

@Component({
  template: `
    <ng-template #customHeader let-context>
      {{ context.column.id }}
    </ng-template>

    <ng-template #customCell let-context>
      {{ context.getValue() }}
    </ng-template>
  `,
})
export class AppComponent {
  readonly customHeader =
    viewChild.required<TemplateRef<{ $implicit: HeaderContext<any, any, any> }>>(
      'customHeader',
    )
  readonly customCell =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any, any> }>>(
      'customCell',
    )

  readonly columns: ColumnDef<any>[] = [
    {
      id: 'templated',
      header: () => this.customHeader(),
      cell: () => this.customCell(),
    },
  ]
}
```

`TemplateRef` rendering uses `createEmbeddedView` with an injector that includes the [DI context tokens](#dependency-injection). For reusable render blocks shared across multiple screens, prefer standalone components over `TemplateRef`.

## Dependency injection

`FlexRender` automatically provides DI tokens when rendering components and templates. These tokens are created in the `#getInjector` method of the renderer, which builds a child `Injector` with the render context properties.

### `injectFlexRenderContext`

[`injectFlexRenderContext<T>()`](../reference/functions/injectFlexRenderContext) returns the full props object passed to `*flexRender`. The return type depends on the column definition slot:

- In a `cell` definition: `CellContext<TFeatures, TData, TValue>`
- In a `header`/`footer` definition: `HeaderContext<TFeatures, TData, TValue>`

```ts
import { Component } from '@angular/core'
import {
  injectFlexRenderContext,
  type CellContext,
} from '@tanstack/angular-table'

@Component({
  template: `
    <span>{{ context.getValue() }}</span>
    <button (click)="context.row.toggleSelected()">Toggle</button>
  `,
})
export class InteractiveCellComponent {
  readonly context = injectFlexRenderContext<CellContext<any, any, any>>()
}
```

Internally, the renderer wraps the context in a `Proxy` so that property access always reflects the latest values, even after re-renders.

### Context directives

Three optional directives let you expose table, header, and cell context to **any descendant** in the template — not just components rendered by `*flexRender`.

This eliminates prop drilling: instead of passing data through multiple `input()` layers, any nested component or directive can inject the context directly.

| Directive | Selector | Token | Inject helper |
|---|---|---|---|
| [`TanStackTable`](../reference/functions/injectTableContext) | `[tanStackTable]` | `TanStackTableToken` | `injectTableContext()` |
| [`TanStackTableHeader`](../reference/functions/injectTableHeaderContext) | `[tanStackTableHeader]` | `TanStackTableHeaderToken` | `injectTableHeaderContext()` |
| [`TanStackTableCell`](../reference/functions/injectTableCellContext) | `[tanStackTableCell]` | `TanStackTableCellToken` | `injectTableCellContext()` |

Import them alongside `FlexRender`:

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
export class AppComponent {}
```

Apply them in the template to establish injection scopes:

```html
<table [tanStackTable]="table">
   <!-- components can access to table context -->

  @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
    <tr>
      @for (header of headerGroup.headers; track header.id) {
        <th [tanStackTableHeader]="header">
            <!-- components can access to table header context -->
        </th>
      }
    </tr>
  }

  @for (row of table.getRowModel().rows; track row.id) {
    <tr>
      @for (cell of row.getVisibleCells(); track cell.id) {
        <td [tanStackTableCell]="cell">
            <!-- components can access to table cell context -->
        </td>
      }
    </tr>
  }
</table>
```

Any component nested inside a `[tanStackTableCell]` host can inject the cell context:

```ts
import { Component } from '@angular/core'
import { injectTableCellContext } from '@tanstack/angular-table'

@Component({
  template: `
    <button (click)="onAction()">
      Action for {{ cell().id }}
    </button>
  `,
})
export class CellActionsComponent {
  readonly cell = injectTableCellContext()

  onAction() {
    console.log('Cell:', this.cell())
  }
}
```

```html
<!-- No need to pass cell as an input — it's injected -->
<td [tanStackTableCell]="cell">
  <app-cell-actions />
</td>
```

Each directive uses Angular's `providers` array to register a factory that reads its own input signal.

This means the token is scoped to the directive's host element and its descendants. Multiple `[tanStackTableCell]` directives on different elements provide independent contexts.

### Automatic token injection in FlexRender

When `FlexRender` renders a component or template, it also provides DI tokens automatically based on the render context shape. In the renderer's `#getInjector` method, if the context object contains `table`, `cell`, or `header` properties, the corresponding `TanStackTableToken`, `TanStackTableCellToken`, or `TanStackTableHeaderToken` tokens are provided in the child injector.

This means that even **without** the context directives, components rendered via `*flexRender` can use `injectTableContext()`, `injectTableCellContext()`, and `injectTableHeaderContext()`. The context directives are only needed for components that live **outside** the `*flexRender` rendering tree (e.g. sibling components in the same `<td>`).
