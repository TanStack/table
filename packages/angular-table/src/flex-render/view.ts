import { FlexRenderComponentRef } from './flex-render-component-ref'
import { EmbeddedViewRef, TemplateRef, Type } from '@angular/core'
import type { FlexRenderContent } from '../flex-render'
import { FlexRenderComponent } from './flex-render-component'

export type FlexRenderTypedContent =
  | { kind: 'null' }
  | {
      kind: 'primitive'
      content: string | number | Record<string, any>
    }
  | { kind: 'flexRenderComponent'; content: FlexRenderComponent<unknown> }
  | { kind: 'templateRef'; content: TemplateRef<unknown> }
  | { kind: 'component'; content: Type<unknown> }

export function mapToFlexRenderTypedContent(
  content: FlexRenderContent<any>
): FlexRenderTypedContent {
  if (content === null || content === undefined) {
    return { kind: 'null' }
  }
  if (typeof content === 'string' || typeof content === 'number') {
    return { kind: 'primitive', content }
  }
  if (content instanceof FlexRenderComponent) {
    return { kind: 'flexRenderComponent', content }
  } else if (content instanceof TemplateRef) {
    return { kind: 'templateRef', content }
  } else if (content instanceof Type) {
    return { kind: 'component', content }
  } else {
    return { kind: 'primitive', content }
  }
}

export abstract class FlexRenderView<
  TView extends FlexRenderComponentRef<any> | EmbeddedViewRef<unknown> | null,
  TProps extends Record<string, any> = any,
> {
  view: TView

  #rawContent: FlexRenderContent<TProps>
  #previousContent: FlexRenderTypedContent | undefined
  #content: FlexRenderTypedContent

  protected constructor(
    initialContent: FlexRenderContent<TProps> | null,
    view: TView
  ) {
    this.#rawContent = initialContent
    this.#content = mapToFlexRenderTypedContent(initialContent)
    this.view = view
  }

  get previousContent(): FlexRenderTypedContent {
    return this.#previousContent ?? { kind: 'null' }
  }

  get content() {
    return this.#content
  }

  setContent(content: FlexRenderContent<any>): FlexRenderTypedContent {
    this.#rawContent = content
    this.#previousContent = this.#content
    this.#content = mapToFlexRenderTypedContent(content)
    return this.#content
  }

  abstract updateProps(props: Record<string, any>): void

  abstract dirtyCheck(): void
}

export class FlexRenderTemplateView extends FlexRenderView<
  EmbeddedViewRef<unknown>
> {
  constructor(
    initialContent: FlexRenderContent<any>,
    view: EmbeddedViewRef<unknown>
  ) {
    super(initialContent, view)
  }

  override updateProps(props: Record<string, any>) {
    this.view.markForCheck()
  }

  override dirtyCheck() {
    // Basically a no-op. Currently in all of those cases, we don't need to do any manual update
    // since this type of content is rendered with an EmbeddedViewRef with a proxy as a context,
    // then every time the root component is checked for changes, the getter will be re-evaluated.
  }
}

export class FlexRenderComponentView extends FlexRenderView<
  FlexRenderComponentRef<unknown>
> {
  constructor(
    initialContent: FlexRenderComponent<unknown> | Type<unknown>,
    view: FlexRenderComponentRef<unknown>
  ) {
    super(initialContent, view)
  }

  override updateProps(props: Record<string, any>) {
    this.view.setInputs(props)
  }

  override dirtyCheck() {
    switch (this.content.kind) {
      case 'component': {
        this.view.markAsDirty()
        break
      }
      case 'flexRenderComponent': {
        // the given content instance will always have a different reference that previous one,
        // then in that case instead of recreating the entire view, we will only update what changes
        if (this.view.eq(this.content.content)) {
          this.view.update(this.content.content)
        }
        break
      }
    }
  }
}
