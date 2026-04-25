---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<TDeps, TDepArgs\>

Defined in: [utils.ts:341](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L341)

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

Defined in: [utils.ts:342](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L342)

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

Defined in: [utils.ts:343](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L343)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
