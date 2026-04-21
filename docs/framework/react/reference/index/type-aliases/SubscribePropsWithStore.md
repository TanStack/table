---
id: SubscribePropsWithStore
title: SubscribePropsWithStore
---

# Type Alias: SubscribePropsWithStore\<TFeatures, TData, TSelected\>

```ts
type SubscribePropsWithStore<TFeatures, TData, TSelected> = object;
```

Defined in: [Subscribe.ts:17](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L17)

Subscribe to `table.store` (full table state). The selector receives the full
TableState.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected`

## Properties

### children

```ts
children: (state) => ReactNode | ReactNode;
```

Defined in: [Subscribe.ts:31](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L31)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:30](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L30)

Select from full table state. Re-renders when the selected value changes
(shallow compare).

Required in store mode so you never accidentally subscribe to the whole
store without an explicit projection.

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [Subscribe.ts:22](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L22)
