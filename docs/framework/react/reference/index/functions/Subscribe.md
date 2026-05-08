---
id: Subscribe
title: Subscribe
---

# Function: Subscribe()

## Call Signature

```ts
function Subscribe<TSourceValue>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:125](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L125)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TSourceValue

`TSourceValue`

### Parameters

#### props

[`SubscribePropsWithSourceIdentity`](../type-aliases/SubscribePropsWithSourceIdentity.md)\<`TSourceValue`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

### Examples

```tsx
// As a standalone component — full store
<Subscribe source={table.store} selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
// Entire source (atom or store) — no selector
<Subscribe source={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project source value (e.g. one row’s selection)
<Subscribe
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
function Subscribe<TSourceValue, TSelected>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:128](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L128)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TSourceValue

`TSourceValue`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithSourceWithSelector`](../type-aliases/SubscribePropsWithSourceWithSelector.md)\<`TSourceValue`, `TSelected`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

### Examples

```tsx
// As a standalone component — full store
<Subscribe source={table.store} selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
// Entire source (atom or store) — no selector
<Subscribe source={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project source value (e.g. one row’s selection)
<Subscribe
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
function Subscribe<TFeatures, TSelected>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [Subscribe.ts:131](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L131)

A React component that allows you to subscribe to the table state.

This is useful for opting into state re-renders for specific parts of the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so JSX
contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithStore`](../type-aliases/SubscribePropsWithStore.md)\<`TFeatures`, `TSelected`\>

### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

### Examples

```tsx
// As a standalone component — full store
<Subscribe source={table.store} selector={(state) => ({ rowSelection: state.rowSelection })}>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
// Entire source (atom or store) — no selector
<Subscribe source={table.atoms.rowSelection}>
  {(rowSelection) => <div>...</div>}
</Subscribe>
```

```tsx
// Project source value (e.g. one row’s selection)
<Subscribe
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
