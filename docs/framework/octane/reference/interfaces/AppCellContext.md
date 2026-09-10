---
id: AppCellContext
title: AppCellContext
---

# Interface: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

Defined in: [types.ts:341](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L341)

Enhanced CellContext with pre-bound cell components.
The `cell` property includes the registered cellComponents.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

## Properties

### cell

```ts
cell: Cell_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap> & TCellComponents & object;
```

Defined in: [types.ts:347](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L347)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => unknown;
```

###### Returns

`unknown`

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [types.ts:349](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L349)

***

### getValue

```ts
getValue: Getter<TValue>;
```

Defined in: [types.ts:350](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L350)

***

### renderValue

```ts
renderValue: Getter<TValue | null>;
```

Defined in: [types.ts:351](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L351)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [types.ts:352](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L352)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [types.ts:353](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L353)
