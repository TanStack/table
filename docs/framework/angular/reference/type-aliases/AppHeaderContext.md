---
id: AppHeaderContext
title: AppHeaderContext
---

# Type Alias: AppHeaderContext\<TFeatures, TData, TValue, THeaderComponents\>

```ts
type AppHeaderContext<TFeatures, TData, TValue, THeaderComponents> = object;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:65](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L65)

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

`THeaderComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:71](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L71)

***

### header

```ts
header: Header<TFeatures, TData, TValue> & THeaderComponents & object;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:72](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L72)

#### Type Declaration

##### FlexRender()

```ts
FlexRender: () => unknown;
```

###### Returns

`unknown`

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:74](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L74)
