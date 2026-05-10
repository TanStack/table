---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:69](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L69)

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

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:75](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L75)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:76](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L76)

#### Type Declaration

##### FlexRender

```ts
FlexRender: typeof FlexRender;
```

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:78](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L78)
