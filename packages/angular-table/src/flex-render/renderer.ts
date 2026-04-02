import {
  Injector,
  computed,
  effect,
  runInInjectionContext,
  untracked,
} from '@angular/core'
import { TanStackTableCellToken } from '../helpers/cell'
import { TanStackTableHeaderToken } from '../helpers/header'
import { TanStackTableToken } from '../helpers/table'
import { FlexRenderComponentProps } from './context'
import { FlexRenderFlags } from './flags'
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
  #renderFlags = FlexRenderFlags.ViewFirstRender
  #renderView: FlexRenderView<
    FlexRenderViewAllowedType,
    FlexRenderTypedContent
  > | null = null
  #currentRenderEffectRef: EffectRef | null = null
  #content: () => FlexRenderInputContent<TProps>
  #props: () => TProps
  #injector: () => Injector
  #viewContainerRef: ViewContainerRef
  #templateRef: TemplateRef<unknown>
  #flexRenderComponentFactory: FlexRenderComponentFactory

  readonly #getLatestContentValue = () => {
    const content = this.#content()
    const props = this.#props()
    return typeof content !== 'function'
      ? content
      : runInInjectionContext(this.#injector(), () => content(props))
  }

  readonly #latestContent = computed(() => this.#getLatestContentValue())

  #getContentValue = computed(() => {
    const latestContent = this.#latestContent()
    return mapToFlexRenderTypedContent(latestContent)
  })

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
    let previousContent: FlexRenderInputContent<TProps>
    let previousProps: TProps

    return effect(() => {
      const props = this.#props()
      const content = this.#content()

      if (!(this.#renderFlags & FlexRenderFlags.ViewFirstRender)) {
        if (previousContent !== content) {
          this.#renderFlags |= FlexRenderFlags.ContentChanged
        }
        if (previousProps !== props) {
          this.#renderFlags |= FlexRenderFlags.PropsReferenceChanged
        }
      }

      untracked(() => this.#update())

      if (FlexRenderFlags.ViewFirstRender & this.#renderFlags) {
        this.#renderFlags &= ~FlexRenderFlags.ViewFirstRender
      }

      previousContent = content
      previousProps = props
    })
  }

  destroy(): void {
    if (this.#currentRenderEffectRef) {
      this.#currentRenderEffectRef.destroy()
      this.#currentRenderEffectRef = null
    }
    if (this.#renderView) {
      this.#renderView.unmount()
      this.#renderView = null
    }
  }

  #update() {
    if (
      this.#renderFlags &
      (FlexRenderFlags.ContentChanged | FlexRenderFlags.ViewFirstRender)
    ) {
      this.#render()
      return
    }

    if (this.#renderFlags & FlexRenderFlags.PropsReferenceChanged) {
      if (this.#renderView) this.#renderView.updateProps(this.#props())
      this.#renderFlags &= ~FlexRenderFlags.PropsReferenceChanged
    }

    if (this.#renderFlags & FlexRenderFlags.Dirty) {
      if (this.#renderView) this.#renderView.dirtyCheck()
      this.#renderFlags &= ~FlexRenderFlags.Dirty
    }
  }

  #render() {
    // When the view is recreated from scratch (content change or first render),
    // we have to destroy the current effect listener since it will be recreated
    // skipping the first call (FlexRenderFlags.RenderEffectChecked)
    if (this.#shouldRecreateEntireView() && this.#currentRenderEffectRef) {
      this.#currentRenderEffectRef.destroy()
      this.#currentRenderEffectRef = null
      this.#renderFlags &= ~FlexRenderFlags.RenderEffectChecked
    }

    this.#viewContainerRef.clear()
    if (this.#renderView) {
      this.#renderView.unmount()
      this.#renderView = null
    }

    this.#renderFlags =
      (this.#renderFlags & FlexRenderFlags.ViewFirstRender) |
      (this.#renderFlags & FlexRenderFlags.RenderEffectChecked)

    const resolvedContent = this.#getContentValue()
    this.#renderView = this.#renderViewByContent(resolvedContent)
    // If the content is a function `content(props)`, we initialize an effect
    // to react to changes. If the current fn uses signals, we will set the DirtySignal flag
    // to re-schedule the component updates
    if (
      !this.#currentRenderEffectRef &&
      typeof untracked(this.#content) === 'function'
    ) {
      this.#currentRenderEffectRef = effect(
        () => {
          this.#latestContent()
          if (!(this.#renderFlags & FlexRenderFlags.RenderEffectChecked)) {
            this.#renderFlags |= FlexRenderFlags.RenderEffectChecked
            return
          }
          this.#renderFlags |= FlexRenderFlags.Dirty
          this.#doCheck()
        },
        { injector: this.#viewContainerRef.injector },
      )
    }
  }

  #shouldRecreateEntireView() {
    return (
      this.#renderFlags &
      FlexRenderFlags.ContentChanged &
      FlexRenderFlags.ViewFirstRender
    )
  }

  #doCheck() {
    const latestContent = this.#getContentValue()
    if (latestContent.kind === 'null' || !this.#renderView) {
      this.#renderFlags |= FlexRenderFlags.ContentChanged
    } else {
      const { kind: currentKind } = this.#renderView.content
      if (
        latestContent.kind !== currentKind ||
        !this.#renderView.eq(latestContent)
      ) {
        this.#renderFlags |= FlexRenderFlags.ContentChanged
      }
      this.#renderView.content = latestContent
    }
    this.#update()
  }

  #renderViewByContent(
    content: FlexRenderTypedContent,
  ): FlexRenderView<FlexRenderViewAllowedType, FlexRenderTypedContent> | null {
    if (content.kind === 'primitive') {
      return this.#renderStringContent(content)
    } else if (content.kind === 'templateRef') {
      return this.#renderTemplateRefContent(content)
    } else if (content.kind === 'flexRenderComponent') {
      return this.#renderComponent(content)
    } else if (content.kind === 'component') {
      return this.#renderCustomComponent(content)
    } else {
      return null
    }
  }

  #renderStringContent(
    template: Extract<FlexRenderTypedContent, { kind: 'primitive' }>,
  ): FlexRenderTemplateView {
    const context = () => {
      const content = this.#content()
      return typeof content === 'string' || typeof content === 'number'
        ? content
        : runInInjectionContext(this.#injector(), () =>
            content?.(this.#props()),
          )
    }
    const ref = this.#viewContainerRef.createEmbeddedView(this.#templateRef, {
      get $implicit() {
        return context()
      },
    })
    return new FlexRenderTemplateView(template, ref)
  }

  #renderTemplateRefContent(
    template: Extract<FlexRenderTypedContent, { kind: 'templateRef' }>,
  ): FlexRenderTemplateView {
    const latestContext = () => this.#props()
    const view = this.#viewContainerRef.createEmbeddedView(
      template.content,
      {
        get $implicit() {
          return latestContext()
        },
      },
      { injector: this.#getInjector() },
    )
    return new FlexRenderTemplateView(template, view)
  }

  #renderComponent(
    flexRenderComponent: Extract<
      FlexRenderTypedContent,
      { kind: 'flexRenderComponent' }
    >,
  ): FlexRenderComponentView {
    const { injector } = flexRenderComponent.content
    const componentInjector = this.#getInjector(injector)
    const view = this.#flexRenderComponentFactory.createComponent(
      flexRenderComponent.content,
      componentInjector,
    )
    return new FlexRenderComponentView(flexRenderComponent, view)
  }

  #renderCustomComponent(
    component: Extract<FlexRenderTypedContent, { kind: 'component' }>,
  ): FlexRenderComponentView {
    const instance = flexRenderComponent(component.content, {
      inputs: this.#props(),
    })
    const injector = this.#getInjector(instance.injector)
    const view = this.#flexRenderComponentFactory.createComponent(
      instance,
      injector,
    )
    return new FlexRenderComponentView(component, view)
  }

  #getInjector(parentInjector?: Injector) {
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
      parent: parentInjector ?? this.#injector(),
      providers: [
        ...staticProviders,
        { provide: FlexRenderComponentProps, useValue: proxy },
      ],
    })
  }
}
