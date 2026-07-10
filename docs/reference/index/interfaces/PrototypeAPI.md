---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<_TDeps, _TDepArgs\>

Defined in: [utils.ts:417](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L417)

## Type Parameters

### _TDeps

`_TDeps` *extends* `ReadonlyArray`\<`any`\>

### _TDepArgs

`_TDepArgs`

## Properties

### fn()

```ts
fn: (self, ...args) => any;
```

Defined in: [utils.ts:418](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L418)

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

Defined in: [utils.ts:419](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L419)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
