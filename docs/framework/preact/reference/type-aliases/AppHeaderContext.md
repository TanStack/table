---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [createTableHook.tsx:64](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L64)

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

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:70](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L70)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [createTableHook.tsx:71](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L71)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => ComponentChildren;
```

###### Returns

`ComponentChildren`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [createTableHook.tsx:73](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L73)
