---
id: AppHeaderContext
title: AppHeaderContext
---

# Interface: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

Defined in: [types.ts:363](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L363)

Enhanced HeaderContext with pre-bound header components.
The `header` property includes the registered headerComponents.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [types.ts:369](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L369)

***

### header

```ts
header: Header_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, Header_FeatureMap> & THeaderComponents & object;
```

Defined in: [types.ts:370](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L370)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => unknown;
```

###### Returns

`unknown`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [types.ts:372](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L372)
