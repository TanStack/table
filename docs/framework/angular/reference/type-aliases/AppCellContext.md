---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:46](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L46)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:52](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L52)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:54](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L54)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:55](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L55)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:56](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L56)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:57](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L57)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:58](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L58)
