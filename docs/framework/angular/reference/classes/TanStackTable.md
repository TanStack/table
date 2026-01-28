---
id: TanStackTable
title: TanStackTable
---

# Class: TanStackTable\<TFeatures, TData, TSelected\>

Defined in: [helpers/table.ts:59](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/table.ts#L59)

Provides a TanStack Table instance (`AngularTable`) in Angular DI.

The table can be injected by:
- any descendant of an element using `[tanStackTable]="..."`
- any component instantiated by `*flexRender` when the render props contains `table`

## Example

```html
<div [tanStackTable]="table">
  <app-pagination />
</div>
```

```ts
@Component({
  selector: 'app-pagination',
  template: `
    <button (click)="prev()" [disabled]="!table().getCanPreviousPage()">Prev</button>
    <button (click)="next()" [disabled]="!table().getCanNextPage()">Next</button>
  `,
})
export class PaginationComponent {
  readonly table = injectTableContext()

  prev() {
    this.table().previousPage()
  }
  next() {
    this.table().nextPage()
  }
}
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` *extends* `object` = `TableState`\<`TFeatures`\>

## Constructors

### Constructor

```ts
new TanStackTable<TFeatures, TData, TSelected>(): TanStackTable<TFeatures, TData, TSelected>;
```

#### Returns

`TanStackTable`\<`TFeatures`, `TData`, `TSelected`\>

## Properties

### table

```ts
readonly table: InputSignal<AngularTable<TFeatures, TData, TSelected>>;
```

Defined in: [helpers/table.ts:69](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/table.ts#L69)

The current TanStack Table instance.

Provided as a required signal input so DI consumers always read the latest value.
