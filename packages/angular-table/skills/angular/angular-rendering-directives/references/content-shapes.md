# Content Shapes — Full Reference

`columnDef.cell` / `header` / `footer` can return any of these — `FlexRender`
dispatches on the shape:

| Returned value                                          | Renderer behavior                                                                                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primitive** (`string`, `number`, `null`, `undefined`) | `createEmbeddedView` on the host `ng-template`; value is the implicit `$implicit` (so `let value` gets the primitive).                                                                  |
| **`TemplateRef`**                                       | `createEmbeddedView` of the template; the render context (`CellContext` / `HeaderContext`) is passed as `$implicit`.                                                                    |
| **Component type** (`Type<T>`)                          | `createComponent` via `ViewContainerRef`; every property of the render context is forwarded via `ComponentRef.setInput(...)` to matching `input()` / `@Input()` slots on the component. |
| **`flexRenderComponent(Component, options)`** wrapper   | `createComponent`, applying the wrapper's explicit `inputs`, `outputs`, `bindings`, `directives`, and optional `injector`.                                                              |

Render functions run inside `runInInjectionContext`, so you can call `inject()`,
read signals, and access DI tokens from within `cell: () => …`.

---

## Returning a primitive

The most common cell — read the value and return it.

```ts
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    cell: (info) => info.getValue(),
  },
]
```

Use the template's `let value` for the primitive:

```html
<td *flexRenderCell="cell; let value">{{ value }}</td>
```

If the primitive is HTML you trust, use `[innerHTML]`:

```html
<td *flexRenderCell="cell; let value">
  <div [innerHTML]="value"></div>
</td>
```

---

## Returning a `TemplateRef`

Capture a template with `viewChild(...)`, then return it from the column def.
The render context arrives as `$implicit`, so use `let context`:

```ts
import { Component, TemplateRef, viewChild } from '@angular/core'
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from '@tanstack/angular-table'

@Component({
  template: `
    <ng-template #ageHeader let-context>
      Age (sorted: {{ context.column.getIsSorted() }})
    </ng-template>

    <ng-template #ageCell let-context>
      <strong>{{ context.getValue() }}</strong>
    </ng-template>
  `,
})
export class App {
  readonly ageHeader =
    viewChild.required<
      TemplateRef<{ $implicit: HeaderContext<any, any, any> }>
    >('ageHeader')
  readonly ageCell =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any, any> }>>(
      'ageCell',
    )

  readonly columns: Array<ColumnDef<any, any>> = [
    {
      accessorKey: 'age',
      header: () => this.ageHeader(),
      cell: () => this.ageCell(),
    },
  ]
}
```

`TemplateRef` rendering creates an injector that includes the DI context tokens,
so descendants inside the template can call `injectTableCellContext()`,
`injectTableHeaderContext()`, etc.

For reusable render blocks shared across screens, prefer a component over a
`TemplateRef`.

---

## Returning an Angular component

You can return a component class directly. The renderer calls `setInput(name, value)`
for every property on the render context — define `input()` (or
`input.required()`) signals matching the names you want.

```ts
import { Component, input } from '@angular/core'
import type { ColumnDef, Table } from '@tanstack/angular-table'

@Component({
  selector: 'app-select-all',
  template: `
    <input
      type="checkbox"
      [checked]="table().getIsAllRowsSelected()"
      [indeterminate]="table().getIsSomeRowsSelected()"
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

> **Only inputs declared with `input()` / `input.required()` are set.** Other
> context properties are silently ignored at the input-binding level — but they
> are still reachable via `injectFlexRenderContext()`.
