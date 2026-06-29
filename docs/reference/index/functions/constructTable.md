---
id: constructTable
title: constructTable
---

# Function: constructTable()

```ts
function constructTable<TFeatures, TData>(tableOptions): Table<TFeatures, TData>;
```

Defined in: [core/table/constructTable.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/constructTable.ts#L32)

Constructs a table instance from normalized table internals.

This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### tableOptions

[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

## Returns

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>
