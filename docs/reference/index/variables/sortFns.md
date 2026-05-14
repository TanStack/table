---
id: sortFns
title: sortFns
---

# Variable: sortFns

```ts
const sortFns: object;
```

Defined in: [fns/sortFns.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/sortFns.ts#L209)

The built-in sorting function registry.

Pass this object to sorted row model creation or extend it with custom sorting functions.

## Type Declaration

### alphanumeric

```ts
alphanumeric: SortFn<any, any> = sortFn_alphanumeric;
```

### alphanumericCaseSensitive

```ts
alphanumericCaseSensitive: SortFn<any, any> = sortFn_alphanumericCaseSensitive;
```

### basic

```ts
basic: SortFn<any, any> = sortFn_basic;
```

### datetime

```ts
datetime: SortFn<any, any> = sortFn_datetime;
```

### text

```ts
text: SortFn<any, any> = sortFn_text;
```

### textCaseSensitive

```ts
textCaseSensitive: SortFn<any, any> = sortFn_textCaseSensitive;
```
