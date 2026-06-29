---
id: filterFns
title: filterFns
---

# Variable: filterFns

```ts
const filterFns: object;
```

Defined in: [fns/filterFns.ts:367](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L367)

The built-in filter function registry.

Pass this object to filtered row model creation or extend it with custom filter functions.

## Type Declaration

### arrHas

```ts
arrHas: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_arrHas;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### arrIncludes

```ts
arrIncludes: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_arrIncludes;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### arrIncludesAll

```ts
arrIncludesAll: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_arrIncludesAll;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### arrIncludesSome

```ts
arrIncludesSome: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_arrIncludesSome;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### between

```ts
between: <TFeatures, TData>(row, columnId, filterValues) => boolean & object = filterFn_between;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### betweenInclusive

```ts
betweenInclusive: <TFeatures, TData>(row, columnId, filterValues) => boolean & object = filterFn_betweenInclusive;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### equals

```ts
equals: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_equals;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### equalsString

```ts
equalsString: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_equalsString;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### includesString

```ts
includesString: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_includesString;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### includesStringSensitive

```ts
includesStringSensitive: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_includesStringSensitive;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

### inNumberRange

```ts
inNumberRange: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_inNumberRange;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`

##### resolveFilterValue()

```ts
resolveFilterValue: (val) => readonly [number, number];
```

###### Parameters

###### val

\[`any`, `any`\]

###### Returns

readonly \[`number`, `number`\]

### weakEquals

```ts
weakEquals: <TFeatures, TData>(row, columnId, filterValue) => boolean & object = filterFn_weakEquals;
```

#### Type Declaration

##### autoRemove()

```ts
autoRemove: (val) => boolean;
```

###### Parameters

###### val

`any`

###### Returns

`boolean`
