---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [createTableHook.ts:48](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L48)

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

Defined in: [createTableHook.ts:54](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L54)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => TemplateResult | string | null;
```

###### Returns

`TemplateResult` \| `string` \| `null`

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.ts:58](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L58)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [createTableHook.ts:59](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L59)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [createTableHook.ts:60](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L60)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [createTableHook.ts:61](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L61)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [createTableHook.ts:62](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L62)
