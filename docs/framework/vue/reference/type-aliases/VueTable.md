---
id: VueTable
title: VueTable
---

# Type Alias: VueTable\<TFeatures, TData\>

```ts
type VueTable<TFeatures, TData> = Table<TFeatures, TData> & object;
```

Defined in: [packages/vue-table/src/useTable.ts:54](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L54)

## Type Declaration

### Subscribe()

```ts
Subscribe: (props) => VNode | VNode[];
```

Creates a reactive render boundary. The child function reads the table
atoms it needs, so Vue only tracks those atom reads.

#### Parameters

##### props

###### children

(`atoms`) => `VNode` \| `VNode`[]

#### Returns

`VNode` \| `VNode`[]

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`
