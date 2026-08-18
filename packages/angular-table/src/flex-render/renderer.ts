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
  #outerRenderEffectRef: EffectRef | null = null
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

  readonly #getContentValue = computed(() => {
    return mapToFlexRenderTypedContent(this.#latestContent())
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
    if (this.#outerRenderEffectRef) {
      return this.#outerRenderEffectRef
    }

    let previousContent: FlexRenderInputContent<TProps> | undefined
    let previousProps: TProps | undefined

    this.#outerRenderEffectRef = effect(
      () => {
        const props = this.#props()
        const content = this.#content()

        if (!(this.#renderFlags & FlexRenderFlags.ViewFirstRender)) {
          if (previousContent !== content) {
            // A new content input may install a different render function (or
            // stop rendering a function), so its dependency effect must be
            // replaced. Incompatible values returned by the same function only
            // recreate the view and keep the existing effect.
            this.#destroyContentEffect()
            this.#renderFlags |= FlexRenderFlags.ContentChanged
          }
          if (previousProps !== props) {
            this.#renderFlags |= FlexRenderFlags.PropsReferenceChanged
          }
        }

        untracked(() => this.#update())

        if (this.#renderFlags & FlexRenderFlags.ViewFirstRender) {
          this.#renderFlags &= ~FlexRenderFlags.ViewFirstRender
        }

        previousContent = content
        previousProps = props
      },
      { injector: this.#viewContainerRef.injector },
    )

    return this.#outerRenderEffectRef
  }

  destroy(): void {
    if (this.#outerRenderEffectRef) {
      this.#outerRenderEffectRef.destroy()
      this.#outerRenderEffectRef = null
    }
    this.#destroyContentEffect()
    this.#destroyView()
    this.#renderFlags = FlexRenderFlags.ViewFirstRender
  }

  #destroyContentEffect(): void {
    if (this.#currentRenderEffectRef) {
      this.#currentRenderEffectRef.destroy()
      this.#currentRenderEffectRef = null
    }
    this.#renderFlags &= ~FlexRenderFlags.RenderEffectChecked
  }

  #update(): void {
    if (
      this.#renderFlags &
      (FlexRenderFlags.ContentChanged | FlexRenderFlags.ViewFirstRender)
    ) {
      this.#render()
      return
    }

    if (this.#renderFlags & FlexRenderFlags.PropsReferenceChanged) {
      this.#renderView?.updateProps(this.#props())
      this.#renderFlags &= ~FlexRenderFlags.PropsReferenceChanged
    }

    if (this.#renderFlags & FlexRenderFlags.Dirty) {
      this.#renderView?.dirtyCheck()
      this.#renderFlags &= ~FlexRenderFlags.Dirty
    }
  }

  #render(): void {
    // Resolved content can require a new view without changing the render
    // function. Preserve its effect and checked state across that replacement.
    this.#destroyView()

    this.#renderFlags &=
      FlexRenderFlags.ViewFirstRender | FlexRenderFlags.RenderEffectChecked

    const content = this.#getContentValue()
    this.#renderView = this.#renderViewByContent(content)

    // Render functions can read signals. Keep their dependency tracking in a
    // dedicated effect so the outer effect remains responsible only for
    // content and props input-reference changes.
    if (
      !this.#currentRenderEffectRef &&
      typeof untracked(this.#content) === 'function'
    ) {
      this.#currentRenderEffectRef = effect(
        () => {
          const latestContent = this.#getContentValue()
          if (!(this.#renderFlags & FlexRenderFlags.RenderEffectChecked)) {
            this.#renderFlags |= FlexRenderFlags.RenderEffectChecked
            return
          }

          untracked(() => {
            this.#renderFlags |= FlexRenderFlags.Dirty
            this.#doCheck(latestContent)
          })
        },
        { injector: this.#viewContainerRef.injector },
      )
    }
  }

  #doCheck(latestContent: FlexRenderTypedContent): void {
    if (
      latestContent.kind === 'null' ||
      !this.#renderView ||
      !this.#renderView.canReuse(latestContent)
    ) {
      this.#renderFlags |= FlexRenderFlags.ContentChanged
    } else {
      this.#renderView.content = latestContent
    }

    this.#update()
  }

  #destroyView(): void {
    if (this.#renderView) {
      this.#renderView.unmount()
      this.#renderView = null
    }
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
    }
    return null
  }

  #renderStringContent(
    template: Extract<FlexRenderTypedContent, { kind: 'primitive' }>,
  ): FlexRenderTemplateView {
    const latestContent = () => untracked(this.#getContentValue)
    const ref = this.#viewContainerRef.createEmbeddedView(this.#templateRef, {
      get $implicit() {
        // The view can be checked while an incompatible replacement is being
        // scheduled. Only expose content that still belongs to this context.
        const content = latestContent()
        return content.kind === 'primitive' ? content.content : undefined
      },
    })
    return new FlexRenderTemplateView(template, ref)
  }

  #renderTemplateRefContent(
    template: Extract<FlexRenderTypedContent, { kind: 'templateRef' }>,
  ): FlexRenderTemplateView {
    const latestProps = () => untracked(this.#props)
    const view = this.#viewContainerRef.createEmbeddedView(
      template.content,
      {
        get $implicit() {
          return latestProps()
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
    const componentInjector = this.#getInjector(
      flexRenderComponent.content.injector,
    )
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
