---
id: Subscribe
title: Subscribe
---

# Function: Subscribe()

## Call Signature

```ts
function Subscribe<TFeatures, TData, TAtomValue>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:138](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L138)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

#### TAtomValue

`TAtomValue`

### Parameters

#### props

[`SubscribePropsWithAtomIdentity`](../type-aliases/SubscribePropsWithAtomIdentity.md)\<`TFeatures`, `TData`, `TAtomValue`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

### Examples

```tsx
// As a standalone component — full store
<Subscribe table={table} selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
// Entire slice atom (no selector)
<Subscribe table={table} atom={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project atom value (e.g. one row’s selection)
<Subscribe
  table={table}
  atom={table.atoms.rowSelection}
  selector={(rowSelection) => rowSelection?.[row.id]}
>
  {(selected) => <tr data-selected={!!selected}>...</tr>}
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

## Call Signature

```ts
function Subscribe<TFeatures, TData, TAtomValue, TSelected>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:145](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L145)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

#### TAtomValue

`TAtomValue`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithAtomWithSelector`](../type-aliases/SubscribePropsWithAtomWithSelector.md)\<`TFeatures`, `TData`, `TAtomValue`, `TSelected`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

### Examples

```tsx
// As a standalone component — full store
<Subscribe table={table} selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
// Entire slice atom (no selector)
<Subscribe table={table} atom={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project atom value (e.g. one row’s selection)
<Subscribe
  table={table}
  atom={table.atoms.rowSelection}
  selector={(rowSelection) => rowSelection?.[row.id]}
>
  {(selected) => <tr data-selected={!!selected}>...</tr>}
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

## Call Signature

```ts
function Subscribe<TFeatures, TData, TSelected>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:158](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L158)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithStore`](../type-aliases/SubscribePropsWithStore.md)\<`TFeatures`, `TData`, `TSelected`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

### Examples

```tsx
// As a standalone component — full store
<Subscribe table={table} selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
// Entire slice atom (no selector)
<Subscribe table={table} atom={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project atom value (e.g. one row’s selection)
<Subscribe
  table={table}
  atom={table.atoms.rowSelection}
  selector={(rowSelection) => rowSelection?.[row.id]}
>
  {(selected) => <tr data-selected={!!selected}>...</tr>}
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
