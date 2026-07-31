---
id: API
title: API
---

# Type Alias: API

```ts
type API = 
  | {
  compare?: (previous, next) => boolean;
  computed: () => any;
  fn?: never;
}
  | {
  compare?: never;
  computed?: never;
  fn: (...args) => any;
};
```

Defined in: [utils.ts:325](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L325)
