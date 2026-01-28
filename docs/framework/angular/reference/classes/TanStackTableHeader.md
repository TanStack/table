---
id: TanStackTableHeader
title: TanStackTableHeader
---

# Class: TanStackTableHeader\<TFeatures, TData, TValue\>

Defined in: [helpers/header.ts:71](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/header.ts#L71)

Provides a TanStack Table `Header` instance in Angular DI.

The header can be injected by:
- any descendant of an element using `[tanStackTableHeader]="..."`
- any component instantiated by `*flexRender` when the render props contains `header`

## Example

```html
<th [tanStackTableHeader]="header">
  <app-sort-indicator />
</th>
```

```ts
@Component({
  selector: 'app-sort-indicator',
  template: `
    <button (click)="toggle()">
      {{ header().column.id }}
    </button>
  `,
})
export class SortIndicatorComponent {
  readonly header = injectTableHeaderContext()

  toggle() {
    this.header().column.toggleSorting()
  }
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

- [`TanStackTableHeaderContext`](../interfaces/TanStackTableHeaderContext.md)\<`TFeatures`, `TData`, `TValue`\>

## Constructors

### Constructor

```ts
new TanStackTableHeader<TFeatures, TData, TValue>(): TanStackTableHeader<TFeatures, TData, TValue>;
```

#### Returns

`TanStackTableHeader`\<`TFeatures`, `TData`, `TValue`\>

## Properties

### header

```ts
readonly header: InputSignal<Header<TFeatures, TData, TValue>>;
```

Defined in: [helpers/header.ts:81](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/header.ts#L81)

The current TanStack Table header.

Provided as a required signal input so DI consumers always read the latest value.

#### Implementation of

[`TanStackTableHeaderContext`](../interfaces/TanStackTableHeaderContext.md).[`header`](../interfaces/TanStackTableHeaderContext.md#header)
