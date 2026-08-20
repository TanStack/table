---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [packages/lit-table/src/createTableHook.ts:49](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L49)

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

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue> & BoundComponents<TCellComponents> & object;
```

Defined in: [packages/lit-table/src/createTableHook.ts:55](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L55)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => LitRenderable;
```

###### Returns

[`LitRenderable`](LitRenderable.md)

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:59](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L59)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [packages/lit-table/src/createTableHook.ts:60](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L60)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [packages/lit-table/src/createTableHook.ts:61](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L61)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:62](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L62)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:63](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L63)
