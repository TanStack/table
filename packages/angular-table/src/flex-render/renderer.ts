import {
  Injector,
  effect,
  runInInjectionContext,
  untracked,
} from '@angular/core'
import { TanStackTableCellToken } from '../helpers/cell'
import { TanStackTableHeaderToken } from '../helpers/header'
import { TanStackTableToken } from '../helpers/table'
import { FlexRenderComponentProps } from './context'
import { flexRenderComponent } from './flexRenderComponent'
import { FlexRenderComponentFactory } from './flexRenderComponentFactory'
import {
  FlexRenderComponentView,
  FlexRenderTemplateView,
  mapToFlexRenderTypedContent,
} from './view'
import type {
  FlexRenderTypedContent,
  FlexRenderView,
  FlexRenderViewAllowedType,
} from './view'
import type { FlexRenderComponent } from './flexRenderComponent'
import type {
  CellContext,
  CellData,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type {
  EffectRef,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core'

/**
 * Content supported by the `flexRender` directive when declaring
 * a table column header/cell.
 */
export type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | number
  | Type<TProps>
  | FlexRenderComponent<TProps>
  | TemplateRef<{ $implicit: TProps }>
  | null
  | Record<any, any>
  | undefined

/**
 * Input content supported by the `flexRender` directives.
 */
export type FlexRenderInputContent<TProps extends NonNullable<unknown>> =
  | number
  | string
  | ((props: TProps) => FlexRenderContent<TProps>)
  | null
  | undefined

/**
 * Options used to create a {@link FlexViewRenderer}.
 *
 * This renderer is designed to be embedded inside a directive/component that owns the
 * `ViewContainerRef` and possibly a fallback `TemplateRef`.
 */
interface RendererViewOptions<TProps extends NonNullable<unknown>> {
  /**
   * Signal-like getter that returns the latest renderable content.
   */
  content: () => FlexRenderInputContent<TProps>
  /**
   * Signal-like getter returning the current props/context object.
   */
  props: () => NoInfer<TProps>
  /**
   * Getter returning the base injector to evaluate render functions in.
   *
   * If `content` is a function, it will be executed inside this injection context
   * via `runInInjectionContext` so Angular DI works as expected.
   */
  injector: () => Injector
  /**
   * Container that will host the dynamically created view/component.
   */
  viewContainerRef: ViewContainerRef
  /**
   * Fallback template used for primitive rendering.
   *
   * The template is instantiated with `$implicit` set to the primitive string/number.
   */
  templateRef: TemplateRef<unknown>
}

/**
 * Internal view renderer used by Angular TanStack Table to implement `flexRender` directives.
 *
 * @internal Use FlexRender directives instead.
 */
export class FlexViewRenderer<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
  TValue extends CellData,
  TProps extends
    | NonNullable<unknown>
    | CellContext<TFeatures, TRowData, TValue>
    | HeaderContext<TFeatures, TRowData, TValue>,
> {
  #renderView: FlexRenderView<
    FlexRenderViewAllowedType,
    FlexRenderTypedContent
  > | null = null
  #renderEffectRef: EffectRef | null = null
  #previousProps: TProps | undefined
  #content: () => FlexRenderInputContent<TProps>
  #props: () => TProps
  #injector: () => Injector
  #viewContainerRef: ViewContainerRef
  #templateRef: TemplateRef<unknown>
  #flexRenderComponentFactory: FlexRenderComponentFactory

  constructor(options: RendererViewOptions<TProps>) {
    this.#content = options.content
    this.#props = options.props
    this.#injector = options.injector
    this.#templateRef = options.templateRef
    this.#viewContainerRef = options.viewContainerRef
    this.#flexRenderComponentFactory = new FlexRenderComponentFactory(
      this.#viewContainerRef,
    )
  }

  mount(): EffectRef {
    if (this.#renderEffectRef) {
      return this.#renderEffectRef
    }

    this.#renderEffectRef = effect(
      () => {
        const content = this.#content()
        const props = this.#props()
        const injector = this.#injector()
        const resolvedContent =
          typeof content === 'function'
            ? runInInjectionContext(injector, () => content(props))
            : content

        untracked(() =>
          this.#update(
            mapToFlexRenderTypedContent(resolvedContent),
            props,
            injector,
          ),
        )
      },
      { injector: this.#viewContainerRef.injector },
    )

    return this.#renderEffectRef
  }

  destroy(): void {
    if (this.#renderEffectRef) {
      this.#renderEffectRef.destroy()
      this.#renderEffectRef = null
    }
    this.#destroyView()
  }

  #update(
    content: FlexRenderTypedContent,
    props: TProps,
    injector: Injector,
  ): void {
    if (content.kind === 'null') {
      this.#destroyView()
      this.#previousProps = props
      return
    }

    const parentInjector =
      content.kind === 'flexRenderComponent'
        ? (content.content.injector ?? injector)
        : injector
    const renderView = this.#renderView

    if (!renderView || !renderView.eq(content)) {
      this.#render(content, props, parentInjector)
      return
    }

    const propsChanged = this.#previousProps !== props
    renderView.content = content
    if (propsChanged) {
      renderView.updateProps(props)
    }
    renderView.dirtyCheck()
    this.#previousProps = props
  }

  #render(
    content: Exclude<FlexRenderTypedContent, { kind: 'null' }>,
    props: TProps,
    parentInjector: Injector,
  ): void {
    this.#destroyView()
    this.#renderView = this.#renderViewByContent(content, props, parentInjector)
    this.#previousProps = props
  }

  #destroyView(): void {
    if (this.#renderView) {
      this.#renderView.unmount()
      this.#renderView = null
    }
  }

  #renderViewByContent(
    content: Exclude<FlexRenderTypedContent, { kind: 'null' }>,
    props: TProps,
    parentInjector: Injector,
  ): FlexRenderView<FlexRenderViewAllowedType, FlexRenderTypedContent> | null {
    if (content.kind === 'primitive') {
      return this.#renderStringContent(content)
    } else if (content.kind === 'templateRef') {
      return this.#renderTemplateRefContent(content, props, parentInjector)
    } else if (content.kind === 'flexRenderComponent') {
      return this.#renderComponent(content, parentInjector)
    }
    return this.#renderCustomComponent(content, props, parentInjector)
  }

  #renderStringContent(
    template: Extract<FlexRenderTypedContent, { kind: 'primitive' }>,
  ): FlexRenderTemplateView {
    const ref = this.#viewContainerRef.createEmbeddedView(this.#templateRef, {
      $implicit: template.content,
    })
    return new FlexRenderTemplateView(template, ref)
  }

  #renderTemplateRefContent(
    template: Extract<FlexRenderTypedContent, { kind: 'templateRef' }>,
    props: TProps,
    parentInjector: Injector,
  ): FlexRenderTemplateView {
    const view = this.#viewContainerRef.createEmbeddedView(
      template.content,
      { $implicit: props },
      { injector: this.#getInjector(parentInjector) },
    )
    return new FlexRenderTemplateView(template, view)
  }

  #renderComponent(
    flexRenderComponent: Extract<
      FlexRenderTypedContent,
      { kind: 'flexRenderComponent' }
    >,
    parentInjector: Injector,
  ): FlexRenderComponentView {
    const componentInjector = this.#getInjector(parentInjector)
    const view = this.#flexRenderComponentFactory.createComponent(
      flexRenderComponent.content,
      componentInjector,
    )
    return new FlexRenderComponentView(flexRenderComponent, view)
  }

  #renderCustomComponent(
    component: Extract<FlexRenderTypedContent, { kind: 'component' }>,
    props: TProps,
    parentInjector: Injector,
  ): FlexRenderComponentView {
    const instance = flexRenderComponent(component.content, {
      inputs: props,
    })
    const injector = this.#getInjector(parentInjector)
    const view = this.#flexRenderComponentFactory.createComponent(
      instance,
      injector,
    )
    return new FlexRenderComponentView(component, view)
  }

  #getInjector(parentInjector: Injector) {
    const getContext = () => this.#props()
    const proxy = new Proxy(this.#props(), {
      get: (_, key) => getContext()[key as keyof typeof _],
    })

    const staticProviders = []
    if ('table' in proxy) {
      staticProviders.push({
        provide: TanStackTableToken,
        useValue: () => proxy.table,
      })
    }
    if ('cell' in proxy) {
      staticProviders.push({
        provide: TanStackTableCellToken,
        useValue: () => proxy.cell,
      })
    }
    if ('header' in proxy) {
      staticProviders.push({
        provide: TanStackTableHeaderToken,
        useValue: () => proxy.header,
      })
    }

    return Injector.create({
      parent: parentInjector,
      providers: [
        ...staticProviders,
        { provide: FlexRenderComponentProps, useValue: proxy },
      ],
    })
  }
}
