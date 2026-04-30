---
id: TableFeature
title: TableFeature
---

# Interface: TableFeature\<TConstructors\>

Defined in: [types/TableFeatures.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L116)

## Type Parameters

### TConstructors

`TConstructors` *extends* [`FeatureConstructors`](FeatureConstructors.md)

## Properties

### assignCellPrototype?

```ts
optional assignCellPrototype: AssignCellPrototype<TConstructors>;
```

Defined in: [types/TableFeatures.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L121)

Assigns Cell APIs to the cell prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all cells.

***

### assignColumnPrototype?

```ts
optional assignColumnPrototype: AssignColumnPrototype<TConstructors>;
```

Defined in: [types/TableFeatures.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L126)

Assigns Column APIs to the column prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all columns.

***

### assignHeaderPrototype?

```ts
optional assignHeaderPrototype: AssignHeaderPrototype<TConstructors>;
```

Defined in: [types/TableFeatures.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L131)

Assigns Header APIs to the header prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all headers.

***

### assignRowPrototype?

```ts
optional assignRowPrototype: AssignRowPrototype<TConstructors>;
```

Defined in: [types/TableFeatures.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L136)

Assigns Row APIs to the row prototype for memory-efficient method sharing.
This is called once per table to build a shared prototype for all rows.

***

### constructTableAPIs?

```ts
optional constructTableAPIs: ConstructTableAPIs<TConstructors>;
```

Defined in: [types/TableFeatures.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L141)

Assigns Table APIs to the table instance.
Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.

***

### getDefaultColumnDef?

```ts
optional getDefaultColumnDef: GetDefaultColumnDef<TConstructors>;
```

Defined in: [types/TableFeatures.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L142)

***

### getDefaultTableOptions?

```ts
optional getDefaultTableOptions: GetDefaultTableOptions<TConstructors>;
```

Defined in: [types/TableFeatures.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L143)

***

### getInitialState?

```ts
optional getInitialState: GetInitialState<TConstructors>;
```

Defined in: [types/TableFeatures.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L144)

***

### initRowInstanceData?

```ts
optional initRowInstanceData: InitRowInstanceData<TConstructors>;
```

Defined in: [types/TableFeatures.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L149)

Initializes instance-specific data on each row (e.g., caches).
Methods should be assigned via assignRowPrototype instead.
