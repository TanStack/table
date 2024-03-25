---
title: Angular Table
---

The `@tanstack/angular-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing state the "angular" way, providing types and the rendering implementation of cell/header/footer templates.

## Exports

`@tanstack/angular-table` re-exports all of `@tanstack/table-core`'s and the following:

### `createAngularTable`

Takes an `options` object and returns a table.

```ts
import { createAngularTable } from '@tanstack/angular-table'

ngOnInit() {
  this.table = createAngularTable(options)
}
// ...render your table in template

```

### `FlexRender`

A Angular component for rendering cell/header/footer templates with dynamic values.

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
              {{ cell }}
            </ng-container>
          </td>
        }
      </tr>
    }
  </tbody>
</template>
```
