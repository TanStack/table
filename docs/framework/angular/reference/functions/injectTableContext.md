---
id: injectTableContext
title: injectTableContext
---

# Function: injectTableContext()

```ts
function injectTableContext<TFeatures, TData>(): Signal<AngularTable<TFeatures, TData>>;
```

Defined in: [packages/angular-table/src/helpers/table.ts:80](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/table.ts#L80)

Injects the current TanStack Table instance signal.

Available when:
- there is a nearest `[tanStackTable]` directive in the DI tree, or
- the caller is rendered via `*flexRender` with render props containing `table`

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Returns

`Signal`\<[`AngularTable`](../type-aliases/AngularTable.md)\<`TFeatures`, `TData`\>\>
