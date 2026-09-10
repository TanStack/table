---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<_TDeps, _TDepArgs\>

Defined in: [utils.ts:569](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L569)

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

Defined in: [utils.ts:570](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L570)

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

Defined in: [utils.ts:571](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L571)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
