---
id: AppCellContext
title: AppCellContext
---

# Type Alias: AppCellContext\<TFeatures, TData, TValue, TCellComponents\>

```ts
type AppCellContext<TFeatures, TData, TValue, TCellComponents> = object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:50](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L50)

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
cell: Cell<TFeatures, TData, TValue> & TCellComponents & object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:56](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L56)

#### Type Declaration

##### FlexRender

```ts
FlexRender: typeof FlexRender;
```

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:58](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L58)

***

### getValue

```ts
getValue: CellContext<TFeatures, TData, TValue>["getValue"];
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:59](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L59)

***

### renderValue

```ts
renderValue: CellContext<TFeatures, TData, TValue>["renderValue"];
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:60](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L60)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:61](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L61)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:62](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L62)
