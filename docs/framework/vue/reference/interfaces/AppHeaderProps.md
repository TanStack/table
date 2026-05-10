---
id: AppHeaderProps
title: AppHeaderProps
---

# Interface: AppHeaderProps\<TFeatures, TData, TValue, TSelected\>

Defined in: [packages/vue-table/src/createTableHook.ts:212](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L212)

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

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:218](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L218)

***

### selector()?

```ts
optional selector: (state) => TSelected;
```

Defined in: [packages/vue-table/src/createTableHook.ts:219](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L219)

#### Parameters

##### state

`TableState`\<`TFeatures`\>

#### Returns

`TSelected`
