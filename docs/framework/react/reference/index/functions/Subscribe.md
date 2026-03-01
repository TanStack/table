---
id: Subscribe
title: Subscribe
---

# Function: Subscribe()

```ts
function Subscribe<TFeatures, TData, TSelected>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:58](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L58)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = \{
\}

## Parameters

### props

[`SubscribeProps`](../type-aliases/SubscribeProps.md)\<`TFeatures`, `TData`, `TSelected`\>

## Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Examples

```tsx
// As a standalone component
<Subscribe table={table} selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
// As table.Subscribe (table instance method)
<table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</table.Subscribe>
```
