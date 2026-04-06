---
id: SubscribeProps
title: SubscribeProps
---

# Type Alias: SubscribeProps\<TFeatures, TData, TSelected\>

```ts
type SubscribeProps<TFeatures, TData, TSelected> = object;
```

Defined in: [Subscribe.ts:13](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L13)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = \{
\}

## Properties

### children

```ts
children: (state) => ReactNode | ReactNode;
```

Defined in: [Subscribe.ts:31](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L31)

The children to render. Can be a function that receives the selected state, or a React node.

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [Subscribe.ts:27](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L27)

A selector function that selects the part of the table state to subscribe to.
This allows for fine-grained reactivity by only re-rendering when the selected state changes.

#### Parameters

##### state

`NoInfer`\<`TableState`\<`TFeatures`\>\>

#### Returns

`TSelected`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [Subscribe.ts:22](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L22)

The table instance to subscribe to. Required when using as a standalone component.
Not needed when using as `table.Subscribe`.
