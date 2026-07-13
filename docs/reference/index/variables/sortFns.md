---
id: sortFns
title: sortFns
---

# ~~Variable: sortFns~~

```ts
const sortFns: object;
```

Defined in: [fns/sortFns.ts:360](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/sortFns.ts#L360)

The built-in sorting function registry.

Registering this full object opts out of tree-shaking: every built-in
sorting function ends up in your bundle. Prefer importing the `sortFn_*`
functions you actually use and registering just those in the `sortFns`
slot, or passing them directly to the `sortFn` column option.

## Type Declaration

### ~~alphanumeric~~

```ts
alphanumeric: CreatedSortFn<any, any> = sortFn_alphanumeric;
```

### ~~alphanumericCaseSensitive~~

```ts
alphanumericCaseSensitive: CreatedSortFn<any, any> = sortFn_alphanumericCaseSensitive;
```

### ~~basic~~

```ts
basic: CreatedSortFn<any, any> = sortFn_basic;
```

### ~~datetime~~

```ts
datetime: CreatedSortFn<any, any> = sortFn_datetime;
```

### ~~text~~

```ts
text: CreatedSortFn<any, any> = sortFn_text;
```

### ~~textCaseSensitive~~

```ts
textCaseSensitive: CreatedSortFn<any, any> = sortFn_textCaseSensitive;
```

## Deprecated

Import individual `sortFn_*` functions instead for a smaller
bundle. This export still works and is not going away in v9, but built-in
name resolution (including `sortFn: 'auto'`) only finds functions you
register yourself.
