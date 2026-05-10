---
id: AppCellProps
title: AppCellProps
---

# Interface: AppCellProps\<TFeatures, TData, TValue, TSelected\>

Defined in: [packages/vue-table/src/createTableHook.ts:202](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L202)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData` = `CellData`

### TSelected

`TSelected` = `unknown`

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:208](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L208)

***

### selector()?

```ts
optional selector: (state) => TSelected;
```

Defined in: [packages/vue-table/src/createTableHook.ts:209](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L209)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`
