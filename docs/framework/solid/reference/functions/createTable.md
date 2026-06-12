---
id: createTable
title: createTable
---

# Function: createTable()

```ts
function createTable<TFeatures, TData>(tableOptions): SolidTable<TFeatures, TData>;
```

Defined in: [createTable.ts:68](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTable.ts#L68)

Creates a Solid table instance backed by Solid-aware TanStack Store atoms.

Table APIs and atom reads participate in Solid dependency tracking, so
computations that read a specific slice can update without invalidating
unrelated UI. Use `table.Subscribe` to create atom-tracked render boundaries.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\>

## Returns

[`SolidTable`](../type-aliases/SolidTable.md)\<`TFeatures`, `TData`\>

## Example

```tsx
const table = createTable(
  {
    features,
    columns,
    data,
  },
)
```
