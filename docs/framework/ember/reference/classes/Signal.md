---
id: Signal
title: Signal
---

# Class: Signal\<T\>

Defined in: packages/ember-table/declarations/signal.d.ts:8

Ember-native signal implementation.
In future ember >7.3 `tracked` will be available by itself
so the class wrapper will not be needed for those versions

## Type Parameters

### T

`T`

## Constructors

### Constructor

```ts
new Signal<T>(value, options): Signal<T>;
```

Defined in: packages/ember-table/declarations/signal.d.ts:11

#### Parameters

##### value

`T`

##### options

`AtomOptions`\<`T`\> | `undefined`

#### Returns

`Signal`\<`T`\>

## Properties

### \_value

```ts
_value: T;
```

Defined in: packages/ember-table/declarations/signal.d.ts:10

## Accessors

### value

#### Get Signature

```ts
get value(): T;
```

Defined in: packages/ember-table/declarations/signal.d.ts:15

##### Returns

`T`

#### Set Signature

```ts
set value(next): void;
```

Defined in: packages/ember-table/declarations/signal.d.ts:16

##### Parameters

###### next

`T`

##### Returns

`void`

## Methods

### get()

```ts
get(): T;
```

Defined in: packages/ember-table/declarations/signal.d.ts:13

#### Returns

`T`

***

### set()

```ts
set(value): void;
```

Defined in: packages/ember-table/declarations/signal.d.ts:14

#### Parameters

##### value

`T` | (`prev`) => `T`

#### Returns

`void`

***

### subscribe()

```ts
subscribe(listenerOrObserver): Subscription;
```

Defined in: packages/ember-table/declarations/signal.d.ts:12

#### Parameters

##### listenerOrObserver

`Observer`\<`T`\> | (`value`) => `void`

#### Returns

`Subscription`

***

### update()

```ts
update(fn): void;
```

Defined in: packages/ember-table/declarations/signal.d.ts:17

#### Parameters

##### fn

(`value`) => `T`

#### Returns

`void`
