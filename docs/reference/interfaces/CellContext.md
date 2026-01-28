---
id: CellContext
title: CellContext
---

# Interface: CellContext\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L8)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L13)

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L14)

***

### getValue

```ts
getValue: Getter<TValue>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L15)

***

### renderValue

```ts
renderValue: Getter<TValue | null>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L16)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L17)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L18)
