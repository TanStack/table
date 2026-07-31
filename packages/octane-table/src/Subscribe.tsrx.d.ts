// Declaration companion for Subscribe.tsrx.
//
// A SPECIFIC module declaration (resolved by relative path), not an ambient
// `declare module '*.tsrx'` — so it types only this module and doesn't pollute a
// consumer's own .tsrx imports. The runtime resolves the authored .tsrx source.
import type { SubscribeComponent } from './types'

export declare const Subscribe: SubscribeComponent
