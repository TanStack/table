---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<TDeps, TDepArgs\>

Defined in: [utils.ts:396](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L396)

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

Defined in: [utils.ts:397](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L397)

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

Defined in: [utils.ts:398](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L398)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
