---
id: FlexRenderCell
title: FlexRenderCell
---

# Class: FlexRenderCell\<TFeatures, TData, TValue\>

Defined in: [helpers/flexRenderCell.ts:62](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/flexRenderCell.ts#L62)

Simplified directive wrapper of `*flexRender`.

Use this utility component to render headers, cells, or footers with custom markup.

Only one prop (`cell`, `header`, or `footer`) may be passed based on the used selector.

## Examples

```html
<td *flexRenderCell="cell; let cell">{{cell}}</td>
<th *flexRenderHeader="header; let header">{{header}}</th>
<th *flexRenderFooter="footer; let footer">{{footer}}</th>
```

This replaces calling `*flexRender` directly like this:
```html
<td *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cell">{{cell}}</td>
<td *flexRender="header.column.columnDef.header; props: header.getContext(); let header">{{header}}</td>
<td *flexRender="footer.column.columnDef.footer; props: footer.getContext(); let footer">{{footer}}</td>
```

Can be imported through FlexRenderCell or [FlexRender](../variables/FlexRender.md) import,
which the latter is preferred.

```ts
import {FlexRender} from '@tanstack/angular-table

@Component({
 // ...
 imports: [
   FlexRender
 ]
})
```

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

## Constructors

### Constructor

```ts
new FlexRenderCell<TFeatures, TData, TValue>(): FlexRenderCell<TFeatures, TData, TValue>;
```

Defined in: [helpers/flexRenderCell.ts:118](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/flexRenderCell.ts#L118)

#### Returns

`FlexRenderCell`\<`TFeatures`, `TData`, `TValue`\>

## Properties

### cell

```ts
readonly cell: InputSignal<Cell<TFeatures, TData, TValue> | undefined>;
```

Defined in: [helpers/flexRenderCell.ts:67](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/flexRenderCell.ts#L67)

***

### footer

```ts
readonly footer: InputSignal<Header<TFeatures, TData, TValue> | undefined>;
```

Defined in: [helpers/flexRenderCell.ts:75](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/flexRenderCell.ts#L75)

***

### header

```ts
readonly header: InputSignal<Header<TFeatures, TData, TValue> | undefined>;
```

Defined in: [helpers/flexRenderCell.ts:71](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/flexRenderCell.ts#L71)
