---
id: PrototypeAPI
title: PrototypeAPI
---

# Type Alias: PrototypeAPI

```ts
type PrototypeAPI = 
  | {
  compare?: (previous, next) => boolean;
  computed: (self) => any;
  fn?: never;
}
  | {
  compare?: never;
  computed?: never;
  fn: (self, ...args) => any;
};
```

Defined in: [utils.ts:383](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L383)
