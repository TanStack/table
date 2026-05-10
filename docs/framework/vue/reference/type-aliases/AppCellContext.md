---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:34](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L34)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue> & TCellComponents & object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:40](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L40)

#### Type Declaration

##### FlexRender

```ts
FlexRender: Component;
```

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:42](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L42)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [packages/vue-table/src/createTableHook.ts:43](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L43)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [packages/vue-table/src/createTableHook.ts:44](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L44)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:45](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L45)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:46](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L46)
