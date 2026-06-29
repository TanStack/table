---
id: sortFns
title: sortFns
---

# Variable: sortFns

```ts
const sortFns: object;
```

Defined in: [fns/sortFns.ts:231](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/sortFns.ts#L231)

The built-in sorting function registry.

Pass this object to sorted row model creation or extend it with custom sorting functions.

## Type Declaration

### alphanumeric()

```ts
alphanumeric: <TFeatures, TData>(rowA, rowB, columnId) => number = sortFn_alphanumeric;
```

Sorts rows with the built-in alphanumeric strategy.

This comparator returns ascending-order results; descending order is applied by the sorting row model.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

`number`

### alphanumericCaseSensitive()

```ts
alphanumericCaseSensitive: <TFeatures, TData>(rowA, rowB, columnId) => number = sortFn_alphanumericCaseSensitive;
```

Sorts rows with the built-in alphanumeric case sensitive strategy.

This comparator returns ascending-order results; descending order is applied by the sorting row model.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

`number`

### basic()

```ts
basic: <TFeatures, TData>(rowA, rowB, columnId) => -1 | 0 | 1 = sortFn_basic;
```

Sorts rows with the built-in basic strategy.

This comparator returns ascending-order results; descending order is applied by the sorting row model.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

`-1` \| `0` \| `1`

### datetime()

```ts
datetime: <TFeatures, TData>(rowA, rowB, columnId) => -1 | 0 | 1 = sortFn_datetime;
```

Sorts rows with the built-in datetime strategy.

This comparator returns ascending-order results; descending order is applied by the sorting row model.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

`-1` \| `0` \| `1`

### text()

```ts
text: <TFeatures, TData>(rowA, rowB, columnId) => -1 | 0 | 1 = sortFn_text;
```

Sorts rows with the built-in text strategy.

This comparator returns ascending-order results; descending order is applied by the sorting row model.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

`-1` \| `0` \| `1`

### textCaseSensitive()

```ts
textCaseSensitive: <TFeatures, TData>(rowA, rowB, columnId) => -1 | 0 | 1 = sortFn_textCaseSensitive;
```

Sorts rows with the built-in text case sensitive strategy.

This comparator returns ascending-order results; descending order is applied by the sorting row model.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

`-1` \| `0` \| `1`
