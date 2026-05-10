---
id: Subscribe
title: Subscribe
---

# Function: Subscribe()

## Call Signature

```ts
function Subscribe<TSourceValue>(props): ComponentChildren;
```

Defined in: [Subscribe.ts:101](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L101)

A Preact component that allows you to subscribe to the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so
JSX contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TSourceValue

`TSourceValue`

### Parameters

#### props

[`SubscribePropsWithSourceIdentity`](../type-aliases/SubscribePropsWithSourceIdentity.md)\<`TSourceValue`\>

### Returns

`ComponentChildren`

### Examples

```tsx
<Subscribe
  source={table.store}
  selector={(state) => ({ rowSelection: state.rowSelection })}
>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
<Subscribe
  source={table.atoms.rowSelection}
  selector={(rowSelection) => rowSelection[row.id]}
>
  {(selected) => <input checked={!!selected} type="checkbox" />}
</Subscribe>
```

## Call Signature

```ts
function Subscribe<TSourceValue, TSelected>(props): ComponentChildren;
```

Defined in: [Subscribe.ts:104](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L104)

A Preact component that allows you to subscribe to the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so
JSX contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TSourceValue

`TSourceValue`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithSourceWithSelector`](../type-aliases/SubscribePropsWithSourceWithSelector.md)\<`TSourceValue`, `TSelected`\>

### Returns

`ComponentChildren`

### Examples

```tsx
<Subscribe
  source={table.store}
  selector={(state) => ({ rowSelection: state.rowSelection })}
>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
<Subscribe
  source={table.atoms.rowSelection}
  selector={(rowSelection) => rowSelection[row.id]}
>
  {(selected) => <input checked={!!selected} type="checkbox" />}
</Subscribe>
```

## Call Signature

```ts
function Subscribe<TFeatures, TSelected>(props): ComponentChildren;
```

Defined in: [Subscribe.ts:107](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L107)

A Preact component that allows you to subscribe to the table state.

For `table.Subscribe` from `useTable`, prefer that API — it uses overloads so
JSX contextual typing works. This standalone component uses a union `props` type.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithStore`](../type-aliases/SubscribePropsWithStore.md)\<`TFeatures`, `TSelected`\>

### Returns

`ComponentChildren`

### Examples

```tsx
<Subscribe
  source={table.store}
  selector={(state) => ({ rowSelection: state.rowSelection })}
>
  {({ rowSelection }) => (
    <div>Selected rows: {Object.keys(rowSelection).length}</div>
  )}
</Subscribe>
```

```tsx
<Subscribe
  source={table.atoms.rowSelection}
  selector={(rowSelection) => rowSelection[row.id]}
>
  {(selected) => <input checked={!!selected} type="checkbox" />}
</Subscribe>
```
