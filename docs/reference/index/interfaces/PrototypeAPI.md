---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<TDeps, TDepArgs\>

Defined in: [utils.ts:361](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L361)

## Type Parameters

### TDeps

`TDeps` *extends* `ReadonlyArray`\<`any`\>

### TDepArgs

`TDepArgs`

## Properties

### fn()

```ts
fn: (self, ...args) => any;
```

Defined in: [utils.ts:362](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L362)

#### Parameters

##### self

`any`

##### args

...`any`

#### Returns

`any`

***

### memoDeps()?

```ts
optional memoDeps: (self, depArgs?) => any[] | undefined;
```

Defined in: [utils.ts:363](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L363)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
