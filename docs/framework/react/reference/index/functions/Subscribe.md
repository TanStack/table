---
id: Subscribe
title: Subscribe
---

# Function: Subscribe()

## Call Signature

```ts
function Subscribe<TFeatures, TData, TSourceValue>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:148](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L148)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

#### TSourceValue

`TSourceValue`

### Parameters

#### props

[`SubscribePropsWithSourceIdentity`](../type-aliases/SubscribePropsWithSourceIdentity.md)\<`TFeatures`, `TData`, `TSourceValue`\>

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
// Entire source (atom or store) — no selector
<Subscribe table={table} source={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project source value (e.g. one row’s selection)
<Subscribe
  table={table}
  source={table.atoms.rowSelection}
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
function Subscribe<TFeatures, TData, TSourceValue, TSelected>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:155](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L155)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

#### TSourceValue

`TSourceValue`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithSourceWithSelector`](../type-aliases/SubscribePropsWithSourceWithSelector.md)\<`TFeatures`, `TData`, `TSourceValue`, `TSelected`\>

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
// Entire source (atom or store) — no selector
<Subscribe table={table} source={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project source value (e.g. one row’s selection)
<Subscribe
  table={table}
  source={table.atoms.rowSelection}
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

Defined in: [Subscribe.ts:168](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L168)

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
// Entire source (atom or store) — no selector
<Subscribe table={table} source={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project source value (e.g. one row’s selection)
<Subscribe
  table={table}
  source={table.atoms.rowSelection}
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
