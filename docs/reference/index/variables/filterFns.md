---
id: filterFns
title: filterFns
---

# ~~Variable: filterFns~~

```ts
const filterFns: object;
```

Defined in: [features/column-filtering/filterFns.ts:434](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L434)

The built-in filter function registry.

Registering this full object opts out of tree-shaking: every built-in
filter function ends up in your bundle. Prefer importing the `filterFn_*`
functions you actually use and registering just those in the `filterFns`
slot, or passing them directly to the `filterFn` column option.

## Type Declaration

### ~~arrHas~~

```ts
arrHas: CreatedFilterFn<any, any> = filterFn_arrHas;
```

### ~~arrIncludes~~

```ts
arrIncludes: CreatedFilterFn<any, any> = filterFn_arrIncludes;
```

### ~~arrIncludesAll~~

```ts
arrIncludesAll: CreatedFilterFn<any, any> = filterFn_arrIncludesAll;
```

### ~~arrIncludesSome~~

```ts
arrIncludesSome: CreatedFilterFn<any, any> = filterFn_arrIncludesSome;
```

### ~~between~~

```ts
between: CreatedFilterFn<any, any> = filterFn_between;
```

### ~~betweenInclusive~~

```ts
betweenInclusive: CreatedFilterFn<any, any> = filterFn_betweenInclusive;
```

### ~~empty~~

```ts
empty: CreatedFilterFn<any, any> = filterFn_empty;
```

### ~~endsWith~~

```ts
endsWith: CreatedFilterFn<any, any> = filterFn_endsWith;
```

### ~~equals~~

```ts
equals: CreatedFilterFn<any, any> = filterFn_equals;
```

### ~~equalsString~~

```ts
equalsString: CreatedFilterFn<any, any> = filterFn_equalsString;
```

### ~~equalsStringSensitive~~

```ts
equalsStringSensitive: CreatedFilterFn<any, any> = filterFn_equalsStringSensitive;
```

### ~~includesString~~

```ts
includesString: CreatedFilterFn<any, any> = filterFn_includesString;
```

### ~~includesStringSensitive~~

```ts
includesStringSensitive: CreatedFilterFn<any, any> = filterFn_includesStringSensitive;
```

### ~~inDateRange~~

```ts
inDateRange: CreatedFilterFn<any, any> = filterFn_inDateRange;
```

### ~~inNumberRange~~

```ts
inNumberRange: CreatedFilterFn<any, any> = filterFn_inNumberRange;
```

### ~~notEmpty~~

```ts
notEmpty: CreatedFilterFn<any, any> = filterFn_notEmpty;
```

### ~~startsWith~~

```ts
startsWith: CreatedFilterFn<any, any> = filterFn_startsWith;
```

### ~~weakEquals~~

```ts
weakEquals: CreatedFilterFn<any, any> = filterFn_weakEquals;
```

## Deprecated

Import individual `filterFn_*` functions instead for a smaller
bundle. This export still works and is not going away in v9, but built-in
name resolution (including `filterFn: 'auto'`) only finds functions you
register yourself.
