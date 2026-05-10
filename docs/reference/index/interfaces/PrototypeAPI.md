---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<TDeps, TDepArgs\>

Defined in: [utils.ts:386](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L386)

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

Defined in: [utils.ts:387](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L387)

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

Defined in: [utils.ts:388](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L388)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
