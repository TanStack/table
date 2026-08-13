import { TemplateRef, Type } from '@angular/core'
import { FlexRenderComponentInstance } from './flexRenderComponent'
import type { FlexRenderComponent } from './flexRenderComponent'
import type { FlexRenderContent } from './renderer'
import type { EmbeddedViewRef } from '@angular/core'
import type { FlexRenderComponentRef } from './flexRenderComponentFactory'

export type FlexRenderTypedContent =
  | { kind: 'null' }
  | {
      kind: 'primitive'
      content: string | number | Record<string, any>
    }
  | { kind: 'flexRenderComponent'; content: FlexRenderComponent<unknown> }
  | { kind: 'templateRef'; content: TemplateRef<unknown> }
  | { kind: 'component'; content: Type<unknown> }

/**
 * Normalizes arbitrary Angular flex-render content into the renderer's internal
 * tagged representation.
 *
 * This lets the directive decide whether to reuse, update, or recreate an
 * embedded view or component view.
 */
export function mapToFlexRenderTypedContent(
  content: FlexRenderContent<any>,
): FlexRenderTypedContent {
  if (content === null || content === undefined) {
    return { kind: 'null' }
  }
  if (typeof content === 'string' || typeof content === 'number') {
    return { kind: 'primitive', content }
  }
  if (content instanceof FlexRenderComponentInstance) {
    return { kind: 'flexRenderComponent', content }
  } else if (content instanceof TemplateRef) {
    return { kind: 'templateRef', content }
  } else if (content instanceof Type) {
    return { kind: 'component', content }
  } else {
    return { kind: 'primitive', content }
  }
}

export type FlexRenderViewAllowedType =
  FlexRenderComponentRef<any> | EmbeddedViewRef<unknown> | null

export abstract class FlexRenderView<
  TView extends FlexRenderViewAllowedType,
  TContent extends FlexRenderTypedContent,
> {
  readonly view: TView
  #content: FlexRenderTypedContent

  protected constructor(
    initialContent: Exclude<FlexRenderTypedContent, { kind: 'null' }>,
    view: TView,
  ) {
    this.#content = initialContent
    this.view = view
  }

  get content() {
    return this.#content
  }

  set content(content: FlexRenderTypedContent) {
    this.#content = content
  }

  abstract updateProps(props: Record<string, any>): void

  abstract dirtyCheck(): void

  abstract canReuse(content: TContent): boolean

  abstract unmount(): void
}

/**
 * Tracks an Angular embedded template view rendered by `FlexRenderDirective`.
 *
 * Template views receive updated props through their proxied context and can be
 * reused while the rendered content kind stays compatible.
 */
export class FlexRenderTemplateView extends FlexRenderView<
  EmbeddedViewRef<unknown>,
  Extract<FlexRenderTypedContent, { kind: 'primitive' | 'templateRef' }>
> {
  constructor(
    initialContent: Extract<
      FlexRenderTypedContent,
      { kind: 'primitive' | 'templateRef' }
    >,
    view: EmbeddedViewRef<unknown>,
  ) {
    super(initialContent, view)
  }

  override updateProps(_props: Record<string, any>) {
    if (this.content.kind === 'templateRef') {
      // Template contexts are getter-backed. Mark the embedded view so Angular
      // reads the latest props; the context object itself does not need to be
      // replaced.
      this.view.markForCheck()
    }
  }

  override dirtyCheck() {
    if (this.content.kind === 'primitive') {
      // Primitive contexts are getter-backed too. The renderer has already
      // memoized the new value, so checking the view is enough to refresh
      // `$implicit` without mutating the context.
      this.view.markForCheck()
    }
  }

  override unmount() {
    this.view.destroy()
  }

  override canReuse(
    compare: Extract<
      FlexRenderTypedContent,
      { kind: 'primitive' | 'templateRef' }
    >,
  ): boolean {
    return (
      (this.content.kind === 'primitive' && compare.kind === 'primitive') ||
      (this.content.kind === 'templateRef' &&
        compare.kind === 'templateRef' &&
        this.content.content === compare.content)
    )
  }
}

/**
 * Tracks an Angular component view rendered by `FlexRenderDirective`.
 *
 * Component views own input/output updates for `flexRenderComponent(...)`
 * results and component classes rendered directly from column definitions.
 */
export class FlexRenderComponentView extends FlexRenderView<
  FlexRenderComponentRef<unknown>,
  Extract<FlexRenderTypedContent, { kind: 'component' | 'flexRenderComponent' }>
> {
  constructor(
    initialContent: Extract<
      FlexRenderTypedContent,
      { kind: 'component' | 'flexRenderComponent' }
    >,
    view: FlexRenderComponentRef<unknown>,
  ) {
    super(initialContent, view)
  }

  override updateProps(props: Record<string, any>) {
    switch (this.content.kind) {
      case 'component': {
        this.view.setInputs(props)
        break
      }
      case 'flexRenderComponent': {
        // No-op. A props change can produce a new wrapper descriptor; its
        // inputs and outputs are synchronized by `dirtyCheck`.
        break
      }
    }
  }

  override dirtyCheck() {
    switch (this.content.kind) {
      case 'component': {
        // Component context is currently valuated with the cell context. Since it's reference
        // shouldn't change, we force mark the component as dirty in order to re-evaluate function invocation in view.
        // NOTE: this should behave like having a component with ChangeDetectionStrategy.Default
        this.view.markAsDirty()
        break
      }
      case 'flexRenderComponent': {
        // Render functions commonly create a new descriptor on every run. If
        // its type and key still identify the mounted instance, update that
        // instance instead of recreating the component view.
        if (this.view.eqType(this.content.content)) {
          this.view.update(this.content.content)
        }
        this.view.markAsDirty()
        break
      }
    }
  }

  override unmount() {
    this.view.componentRef.destroy()
  }

  override canReuse(
    compare: Extract<
      FlexRenderTypedContent,
      { kind: 'component' | 'flexRenderComponent' }
    >,
  ): boolean {
    return (
      (this.content.kind === 'component' &&
        compare.kind === 'component' &&
        this.content.content === compare.content) ||
      (this.content.kind === 'flexRenderComponent' &&
        compare.kind === 'flexRenderComponent' &&
        this.view.canReuse(compare.content))
    )
  }
}
