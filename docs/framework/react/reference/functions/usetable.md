---
id: useTable
title: useTable
---

# Function: useTable()

```ts
function useTable<TFeatures, TData>(tableOptions): Table<TFeatures, TData>
```

Will re-render the table whenever the state or options change. Works just like the `useReactTable` from v8.

## Type Parameters

• **TFeatures** *extends* `TableFeatures`

• **TData** *extends* `unknown`

## Parameters

• **tableOptions**

## Returns

`Table`\<`TFeatures`, `TData`\>

## Example

```ts
const table = useTable({ columns, data, state, ...options })
```

## Defined in

[react-table/src/useTable.ts:32](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/react-table/src/useTable.ts#L32)
