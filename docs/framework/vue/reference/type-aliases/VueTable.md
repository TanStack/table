---
id: VueTable
title: VueTable
---

# Type Alias: VueTable\<TFeatures, TData, TSelected\>

```ts
type VueTable<TFeatures, TData, TSelected> = Table<TFeatures, TData> & object;
```

Defined in: [packages/vue-table/src/useTable.ts:61](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L61)

## Type Declaration

### state

```ts
readonly state: Readonly<TSelected>;
```

The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `useTable`.

#### Example

```ts
const table = useTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state

console.log(table.state.globalFilter)
```

### Subscribe()

```ts
Subscribe: {
<TSourceValue>  (props): 
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>[];
<TSourceValue, TSubSelected>  (props): 
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>[];
<TSubSelected>  (props): 
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>[];
};
```

Store mode: `selector` required. Source mode: pass `source` (atom or store); omit
`selector` for the whole value (identity), or pass `selector` to project. Split
overloads so source-only infers `TSourceValue` for `children` (see React `Subscribe`).

#### Call Signature

```ts
<TSourceValue>(props): 
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>[];
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

##### Parameters

###### props

###### children

(`state`) => `VNode` \| `VNode`[] \| `VNode` \| `VNode`[]

###### selector?

`undefined`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

  \| `VNode`\<`RendererNode`, `RendererElement`, \{
\[`key`: `string`\]: `any`;
\}\>
  \| `VNode`\<`RendererNode`, `RendererElement`, \{
\[`key`: `string`\]: `any`;
\}\>[]

#### Call Signature

```ts
<TSourceValue, TSubSelected>(props): 
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>[];
```

##### Type Parameters

###### TSourceValue

`TSourceValue`

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

###### children

(`state`) => `VNode` \| `VNode`[] \| `VNode` \| `VNode`[]

###### selector

(`state`) => `TSubSelected`

###### source

[`SubscribeSource`](SubscribeSource.md)\<`TSourceValue`\>

##### Returns

  \| `VNode`\<`RendererNode`, `RendererElement`, \{
\[`key`: `string`\]: `any`;
\}\>
  \| `VNode`\<`RendererNode`, `RendererElement`, \{
\[`key`: `string`\]: `any`;
\}\>[]

#### Call Signature

```ts
<TSubSelected>(props): 
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>
  | VNode<RendererNode, RendererElement, {
[key: string]: any;
}>[];
```

##### Type Parameters

###### TSubSelected

`TSubSelected`

##### Parameters

###### props

###### children

(`state`) => `VNode` \| `VNode`[] \| `VNode` \| `VNode`[]

###### selector

(`state`) => `TSubSelected`

##### Returns

  \| `VNode`\<`RendererNode`, `RendererElement`, \{
\[`key`: `string`\]: `any`;
\}\>
  \| `VNode`\<`RendererNode`, `RendererElement`, \{
\[`key`: `string`\]: `any`;
\}\>[]

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>
