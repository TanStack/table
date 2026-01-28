---
id: TanStackTableCell
title: TanStackTableCell
---

# Class: TanStackTableCell\<TFeatures, TData, TValue\>

Defined in: [helpers/cell.ts:76](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/cell.ts#L76)

Provides a TanStack Table `Cell` instance in Angular DI.

The cell can be injected by:
- any descendant of an element using `[tanStackTableCell]="..."`
- any component instantiated by `*flexRender` when the render props contains `cell`

## Examples

Inject from the nearest `[tanStackTableCell]`:
```html
<td [tanStackTableCell]="cell">
  <app-cell-actions />
</td>
```

```ts
@Component({
  selector: 'app-cell-actions',
  template: `{{ cell().id }}`,
})
export class CellActionsComponent {
  readonly cell = injectTableCellContext()
}
```

Inject inside a component rendered via `flexRender`:
```ts
@Component({
  selector: 'app-price-cell',
  template: `{{ cell().getValue() }}`,
})
export class PriceCellComponent {
  readonly cell = injectTableCellContext()
}
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

## Implements

- [`TanStackTableCellContext`](../interfaces/TanStackTableCellContext.md)\<`TFeatures`, `TData`, `TValue`\>

## Constructors

### Constructor

```ts
new TanStackTableCell<TFeatures, TData, TValue>(): TanStackTableCell<TFeatures, TData, TValue>;
```

#### Returns

`TanStackTableCell`\<`TFeatures`, `TData`, `TValue`\>

## Properties

### cell

```ts
readonly cell: InputSignal<Cell<TFeatures, TData, TValue>>;
```

Defined in: [helpers/cell.ts:86](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/cell.ts#L86)

The current TanStack Table cell.

Provided as a required signal input so DI consumers always read the latest value.

#### Implementation of

[`TanStackTableCellContext`](../interfaces/TanStackTableCellContext.md).[`cell`](../interfaces/TanStackTableCellContext.md#cell)
