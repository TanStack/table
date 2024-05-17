---
title: Angular Table
---

The `@tanstack/angular-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing
state the "angular signals" way, providing types and the rendering implementation of cell/header/footer templates.

## Exports

`@tanstack/angular-table` re-exports all of `@tanstack/table-core`'s APIs and the following:

### `createAngularTable`

Accepts an options function or a computed value that returns the table options, and returns a table.

```ts
import {createAngularTable} from '@tanstack/angular-table'

export class AppComponent {
  data = signal<Person[]>([])

  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  }))
}

// ...render your table in template

```

### `FlexRender`

An Angular structural directive for rendering cell/header/footer templates with dynamic values.

FlexRender supports any type of content supported by Angular:

- A string, or a html string via `innerHTML`
- A [TemplateRef](https://angular.dev/api/core/TemplateRef)
- A [Component](https://angular.dev/api/core/Component) wrapped into `FlexRenderComponent`

Example:

```ts
@Component({
  imports: [FlexRenderDirective],
  //...
})
```

```angular2html

<tbody>
@for (row of table.getRowModel().rows; track row.id) {
<tr>
  @for (cell of row.getVisibleCells(); track cell.id) {
<td>
  <ng-container
    *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
  >
    <!-- if you want to render a simple string -->
    {{ cell }}
    <!-- if you want to render an html string -->
    <div [innerHTML]="cell"></div>
  </ng-container>
</td>
}
</tr>
}
</tbody>
```

#### Rendering a TemplateRef

In order to render a TemplateRef into a specific column header/cell/footer, you can pass the TemplateRef into the column
definition.

You can access the TemplateRef data via the `$implicit` property, which is valued based on what is passed in the props
field of flexRender.

In most cases, each TemplateRef will be rendered with the $implicit context valued based on the cell type in this way:

- Header: `HeaderContext<T, ?>`
- Cell: `CellContext<T, ?>`,
- Footer: `HeaderContext<T, ?>`

```angular17html

<ng-container
  *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
>
  <!-- if you want to render a simple string -->
  {{ cell }}
  <!-- if you want to render an html string -->
  <div [innerHTML]="cell"></div>
</ng-container>

<ng-template #myCell let-context>
  <!-- render something with context -->
</ng-template>
```

Full example:

```ts
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from '@tanstack/angular-table'
import {Component, TemplateRef, viewChild} from '@angular/core'

@Component({
  template: `
    <tbody>
      @for (row of table.getRowModel().rows; track row.id) {
        <tr>
          @for (cell of row.getVisibleCells(); track cell.id) {
            <td>
              <ng-container
                *flexRender="
                  cell.column.columnDef.cell;
                  props: cell.getContext(); // Data given to the TemplateRef
                  let cell
                "
              >
                <!-- if you want to render a simple string -->
                {{ cell }}
                <!-- if you want to render an html string -->
                <div [innerHTML]="cell"></div>
              </ng-container>
            </td>
          }
        </tr>
      }
    </tbody>

    <ng-template #customHeader let-context>
      {{ context.getValue() }}
    </ng-template>
    <ng-template #customCell let-context>
      {{ context.getValue() }}
    </ng-template>
  `,
})
class AppComponent {
  customHeader =
    viewChild.required<TemplateRef<{ $implicit: HeaderContext<any, any> }>>(
      'customHeader'
    )
  customCell =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'customCell'
    )

  columns: ColumnDef<unknown>[] = [
    {
      id: 'customCell',
      header: () => this.customHeader(),
      cell: () => this.customCell(),
    },
  ]
}
```

#### Rendering a Component

To render a Component into a specific column header/cell/footer, you can pass a `FlexRenderComponent instantiated with
your `ComponentType, with the ability to include optional parameters such as inputs and an injector.

```ts
import {FlexRenderComponent} from "@tanstack/angular-table";

class AppComponent {
  columns: ColumnDef<unknown>[] = [
    {
      id: 'customCell',
      header: () => new FlexRenderComponent(
        CustomCellComponent,
        {}, // optional inputs
        injector // optional injector
      ),
      cell: () => this.customCell(),
    },
  ]
}
```

Underneath, this utilizes
the [ViewContainerRef#createComponent](https://angular.dev/api/core/ViewContainerRef#createComponent) api.
Therefore, you should declare your custom inputs using the @Input decorator or input/model signals.

You can still access the table cell context through the `injectFlexRenderContext` function, which returns the context
value based on the props you pass to the `FlexRenderDirective`.

```ts
@Component({
  // ...
})
class CustomCellComponent {
  // context of a cell component
  readonly context = injectFlexRenderContext<CellContext<TData, TValue>>();
  // context of a header/footer component
  readonly context = injectFlexRenderContext<HeaderContext<TData, TValue>>();
}
```


