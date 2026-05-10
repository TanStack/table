---
id: SolidTable
title: SolidTable
---

# Type Alias: SolidTable\<TFeatures, TData, TSelected\>

```ts
type SolidTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [createTable.ts:27](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTable.ts#L27)

## Type Declaration

### FlexRender

```ts
FlexRender: typeof FlexRender;
```

Convenience FlexRender component attached to the table instance for
rendering headers, cells, or footers with custom markup. Mirrors the
`table.FlexRender` API exposed by `createTableHook`'s `createAppTable`.

#### Example

```ts
<table.FlexRender header={header} />
<table.FlexRender cell={cell} />
<table.FlexRender footer={footer} />
```

### state

```ts
readonly state: Accessor<Readonly<TSelected>>;
```

The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `createTable`.

#### Example

```ts
const table = createTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state

console.log(table.state().globalFilter)
```

### Subscribe()

```ts
Subscribe: {
<TSourceValue>  (props): Element;
<TSourceValue, TSubSelected>  (props): Element;
<TSubSelected>  (props): Element;
};
```

Subscribe to the store (selector required) or a single source (atom or store).
Source **without** `selector` is a separate overload so children receive
`Accessor<TSourceValue>` (identity projection). Source overloads are listed first
for JSX contextual typing.

#### Call Signature

```ts
<TSourceValue>(props): Element;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

##### Parameters

###### props

###### children

(`state`) => `JSX.Element` \| `JSX.Element`

###### selector?

`undefined`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`Element`

#### Call Signature

```ts
<TSourceValue, TSubSelected>(props): Element;
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

###### children

(`state`) => `JSX.Element` \| `JSX.Element`

###### selector

(`state`) => `TSubSelected`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

`Element`

#### Call Signature

```ts
<TSubSelected>(props): Element;
```

##### Type Parameters

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

###### children

(`state`) => `JSX.Element` \| `JSX.Element`

###### selector

(`state`) => `TSubSelected`

##### Returns

`Element`

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>
