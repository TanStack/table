---
id: VueTable
title: VueTable
---

# Type Alias: VueTable\<TFeatures, TData\>

```ts
type VueTable<TFeatures, TData> = Table<TFeatures, TData> & object;
```

Defined in: [useTable.ts:46](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L46)

## Type Declaration

### ~~Subscribe~~

```ts
Subscribe: (props) => VNode | VNode[];
```

#### Parameters

##### props

###### children

(`atoms`) => `VNode` \| `VNode`[]

#### Returns

`VNode` \| `VNode`[]

#### Deprecated

Read table APIs or `table.atoms` directly inside templates,
render functions, computed values, or watcher sources. Vue tracks those
reads natively. This compatibility wrapper only passes atoms to its child
function and adds no subscription logic.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`
