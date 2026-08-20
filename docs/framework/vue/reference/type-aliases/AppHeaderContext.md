---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:48](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L48)

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

Defined in: [packages/vue-table/src/createTableHook.ts:54](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L54)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:55](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L55)

#### Type Declaration

##### FlexRender

```ts
FlexRender: Component;
```

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:57](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L57)
