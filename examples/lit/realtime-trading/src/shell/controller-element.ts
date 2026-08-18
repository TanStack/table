import { LitElement } from 'lit'
import type { Subscription } from '@tanstack/store'

export abstract class ControllerElement extends LitElement {
  readonly #subscriptions: Array<Subscription> = []
  protected createRenderRoot() {
    return this
  }
  protected observe(source: {
    subscribe: (listener: () => void) => Subscription
  }): void {
    this.#subscriptions.push(source.subscribe(() => this.requestUpdate()))
  }
  disconnectedCallback() {
    for (const subscription of this.#subscriptions) subscription.unsubscribe()
    this.#subscriptions.length = 0
    super.disconnectedCallback()
  }
}
