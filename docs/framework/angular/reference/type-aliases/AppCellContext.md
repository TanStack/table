---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [helpers/createTableHook.ts:47](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L47)

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

`TCellComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue> & TCellComponents & object;
```

Defined in: [helpers/createTableHook.ts:53](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L53)

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

Defined in: [helpers/createTableHook.ts:55](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L55)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [helpers/createTableHook.ts:56](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L56)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [helpers/createTableHook.ts:57](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L57)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [helpers/createTableHook.ts:58](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L58)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [helpers/createTableHook.ts:59](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L59)
