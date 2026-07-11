---
id: ComputedSignal
title: ComputedSignal
---

# Class: ComputedSignal\<T\>

Defined in: packages/ember-table/declarations/signal.d.ts:19

## Type Parameters

### T

`T`

## Constructors

### Constructor

```ts
new ComputedSignal<T>(compute): ComputedSignal<T>;
```

Defined in: packages/ember-table/declarations/signal.d.ts:21

#### Parameters

##### compute

() => `T`

#### Returns

`ComputedSignal`\<`T`\>

## Properties

### subscribe()

```ts
subscribe: () => Subscription;
```

Defined in: packages/ember-table/declarations/signal.d.ts:23

#### Returns

`Subscription`

## Accessors

### value

#### Get Signature

```ts
get value(): T;
```

Defined in: packages/ember-table/declarations/signal.d.ts:24

##### Returns

`T`

## Methods

### get()

```ts
get(): T;
```

Defined in: packages/ember-table/declarations/signal.d.ts:22

#### Returns

`T`
