---
id: filterFn_inNumberRange
title: filterFn_inNumberRange
---

# Variable: filterFn\_inNumberRange

```ts
const filterFn_inNumberRange: <TFeatures, TData>(row, columnId, filterValue) => boolean & object;
```

Defined in: [fns/filterFns.ts:298](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L298)

Keeps rows whose numeric value is inside an inclusive `[min, max]` range.

Filter values are normalized so blank endpoints become open-ended and
reversed endpoints are swapped.

## Type Declaration

### autoRemove()

```ts
autoRemove: (val) => boolean;
```

#### Parameters

##### val

`any`

#### Returns

`boolean`

### resolveFilterValue()

```ts
resolveFilterValue: (val) => readonly [number, number];
```

#### Parameters

##### val

\[`any`, `any`\]

#### Returns

readonly \[`number`, `number`\]
