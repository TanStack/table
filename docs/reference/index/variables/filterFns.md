---
id: filterFns
title: filterFns
---

# Variable: filterFns

```ts
const filterFns: object;
```

Defined in: [fns/filterFns.ts:363](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L363)

The built-in filter function registry.

Pass this object to filtered row model creation or extend it with custom filter functions.

## Type Declaration

### arrHas

```ts
arrHas: FilterFn<any, any> = filterFn_arrHas;
```

### arrIncludes

```ts
arrIncludes: FilterFn<any, any> = filterFn_arrIncludes;
```

### arrIncludesAll

```ts
arrIncludesAll: FilterFn<any, any> = filterFn_arrIncludesAll;
```

### arrIncludesSome

```ts
arrIncludesSome: FilterFn<any, any> = filterFn_arrIncludesSome;
```

### between

```ts
between: FilterFn<any, any> = filterFn_between;
```

### betweenInclusive

```ts
betweenInclusive: FilterFn<any, any> = filterFn_betweenInclusive;
```

### equals

```ts
equals: FilterFn<any, any> = filterFn_equals;
```

### equalsString

```ts
equalsString: FilterFn<any, any> = filterFn_equalsString;
```

### includesString

```ts
includesString: FilterFn<any, any> = filterFn_includesString;
```

### includesStringSensitive

```ts
includesStringSensitive: FilterFn<any, any> = filterFn_includesStringSensitive;
```

### inNumberRange

```ts
inNumberRange: FilterFn<any, any> = filterFn_inNumberRange;
```

### weakEquals

```ts
weakEquals: FilterFn<any, any> = filterFn_weakEquals;
```
