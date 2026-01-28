---
id: injectTableCellContext
title: injectTableCellContext
---

# Function: injectTableCellContext()

```ts
function injectTableCellContext<TFeatures, TData, TValue>(): Signal<Cell<TFeatures, TData, TValue>>;
```

Defined in: [helpers/cell.ts:98](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/cell.ts#L98)

Injects the current TanStack Table cell signal.

Available when:
- there is a nearest `[tanStackTableCell]` directive in the DI tree, or
- the caller is rendered via `*flexRender` with render props containing `cell`

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `unknown`

## Returns

`Signal`\<`Cell`\<`TFeatures`, `TData`, `TValue`\>\>
