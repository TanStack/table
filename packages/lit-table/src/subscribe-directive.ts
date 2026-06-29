import { TanStackStoreSelector } from '@tanstack/lit-store'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import { noChange } from 'lit'
import type { Part, ReactiveControllerHost } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/lit-store'

export type SelectionSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

/**
 * A function that selects a specific slice of state from the source.
 * @template TSource - The complete state type from the store/atom.
 * @template TSelected - The extracted or derived state type.
 */
type Selector<TSource, TSelected> = (state: TSource) => TSelected

/**
 * A render function that takes the selected state and returns content
 * (typically a `TemplateResult`) to be rendered by Lit.
 * @template TSelected - The selected state passed into the template.
 */
type TemplateFunction<TSelected> = (value: TSelected) => unknown

/**
 * A simple identity selector used when no specific selection is needed,
 * allowing the directive to subscribe to the entire state of the source.
 * @template T - The type of the state being passed through unchanged.
 */
const identitySelector = <T>(state: T): T => state

/**
 * An asynchronous Lit directive that subscribes to a `@tanstack/lit-store`
 * source and triggers re-renders specifically for the template portion it wraps.
 * * It uses a "fake" `ReactiveControllerHost` to bridge the gap between
 * TanStack's standard controller requirements and the `AsyncDirective` lifecycle.
 */
export class SubscribeDirective extends AsyncDirective {
  /** The `TanStackStoreSelector` controller that manages the subscription to the store/atom */
  private controller?: TanStackStoreSelector<any, any>

  /** The latest source and selector used to determine if a new subscription is needed on updates */
  private latestSource?: SelectionSource<any>
  /* The latest selector function used to determine if a new subscription is needed on updates */
  private latestSelector?: Selector<any, any>
  /* The latest resolved template function to render the selected state slice */
  private resolvedTemplate?: TemplateFunction<any>
  /* A flag to track whether the directive has been initialized, ensuring that the first render sets up the subscription correctly. */
  private initialized = false

  /**
   * Renders the entire state of the source without a selector.
   * @param source - The store or atom to subscribe to.
   * @param template - The render function receiving the full state.
   */
  render<TSource>(
    source: SelectionSource<TSource>,
    template: TemplateFunction<TSource>,
  ): unknown

  /**
   * Renders a specific slice of state derived via a selector function.
   * @param source - The store or atom to subscribe to.
   * @param selector - A function to extract the relevant slice of state.
   * @param template - The render function receiving the selected state slice.
   */
  render<TSource, TSelected>(
    source: SelectionSource<TSource>,
    selector: Selector<TSource, TSelected>,
    template: TemplateFunction<TSelected>,
  ): unknown

  render(
    _source: SelectionSource<any>,
    _selectorOrTemplate: Selector<any, any> | TemplateFunction<any>,
    _template?: TemplateFunction<any>,
  ) {
    /** The actual rendering is handled in the {@link update} method to ensure that template is only evaluated if needed */
    return noChange
  }

  update(
    _part: Part,
    args:
      | [SelectionSource<any>, TemplateFunction<any>]
      | [SelectionSource<any>, Selector<any, any>, TemplateFunction<any>],
  ) {
    const [source, selectorOrTemplate, template] = args
    const isIdentitySubscription: boolean = template === undefined

    const selector = isIdentitySubscription
      ? identitySelector
      : (selectorOrTemplate as Selector<any, any>)

    const actualTemplate = isIdentitySubscription
      ? (selectorOrTemplate as TemplateFunction<any>)
      : template

    const sourceChanged = this.latestSource !== source
    const selectorChanged = this.latestSelector !== selector
    const shouldReinitialize =
      !this.initialized || sourceChanged || selectorChanged

    if (shouldReinitialize) {
      if (this.initialized) {
        this.controller?.hostDisconnected()
        this.controller = undefined
      }

      this.latestSource = source
      this.latestSelector = selector
      this.resolvedTemplate = actualTemplate

      if (!this.controller) {
        this.controller = new TanStackStoreSelector(
          this.createFakeHost(),
          () => this.latestSource,
          (state) => this.latestSelector?.(state),
        )
      }

      this.controller.hostUpdate()
      this.initialized = true

      return this.resolvedTemplate?.(this.controller.value)
    }

    // Host rerender with same source + selector, so we can skip updating
    return noChange
  }

  /** Cleans up the controller subscription when the directive is removed from the DOM. */
  disconnected() {
    this.controller?.hostDisconnected()
  }

  /** Restores the controller subscription when the directive is re-attached to the DOM. */
  reconnected() {
    this.controller?.hostUpdate()
  }

  /**
   * Creates a mock `ReactiveControllerHost` allowing the `TanStackStoreSelector`
   * to plug into the `AsyncDirective`'s update cycle using `setValue()`.
   */
  private createFakeHost(): ReactiveControllerHost {
    return {
      addController: () => {},
      removeController: () => {},
      requestUpdate: () => {
        if (this.resolvedTemplate && this.controller) {
          this.setValue(this.resolvedTemplate(this.controller.value))
        }
      },
      get updateComplete() {
        return Promise.resolve(true)
      },
    }
  }
}

/**
 * A Lit directive that subscribes to a source (Store or Atom)
 * and efficiently updates only the wrapped template
 * when the state or selected slice changes.
 * @example
 * ```ts
 * // Without a selector (subscribes to entire state)
 * html`<div>${subscribe(myStore, (state) => html`<span>${state.count}</span>`)}</div>`
 * * // With a selector (only updates when `count` changes)
 * html`<div>${subscribe(myStore, state => state.count, (count) => html`<span>${count}</span>`)}</div>`
 * ```
 */
export const subscribe = directive(SubscribeDirective) as {
  /** Subscribes to the entire source state without filtering. */
  <TSource>(
    source: SelectionSource<TSource>,
    template: TemplateFunction<TSource>,
  ): DirectiveResult<typeof SubscribeDirective>

  /**
   * Subscribes to a specific slice of the source state via a selector,
   * preventing unnecessary re-renders when other parts of the state change.
   */
  <TSource, TSelected>(
    source: SelectionSource<TSource>,
    selector: Selector<TSource, TSelected>,
    template: TemplateFunction<TSelected>,
  ): DirectiveResult<typeof SubscribeDirective>
}
