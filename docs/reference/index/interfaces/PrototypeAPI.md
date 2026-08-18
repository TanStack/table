---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<_TDeps, _TDepArgs\>

Defined in: [utils.ts:436](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L436)

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

Defined in: [utils.ts:437](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L437)

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

Defined in: [utils.ts:438](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L438)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
