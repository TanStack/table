import {
  DestroyRef,
  Directive,
  EffectRef,
  Injector,
  InputSignal,
  TemplateRef,
  Type,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  runInInjectionContext,
  untracked,
} from '@angular/core'
import { FlexRenderComponentProps } from './flex-render/context'
import { FlexRenderFlags } from './flex-render/flags'
import {
  FlexRenderComponent,
  flexRenderComponent,
} from './flex-render/flex-render-component'
import { FlexRenderComponentFactory } from './flex-render/flex-render-component-ref'
import {
  FlexRenderComponentView,
  FlexRenderTemplateView,
  FlexRenderView,
  mapToFlexRenderTypedContent,
} from './flex-render/view'
import { TanStackTableCellToken } from './helpers/cell'
import { TanStackTableHeaderToken } from './helpers/header'
import { TanStackTableToken } from './helpers/table'
import type { FlexRenderTypedContent } from './flex-render/view'
import type {
  CellContext,
  CellData,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

export {
  injectFlexRenderContext,
  type FlexRenderComponentProps,
} from './flex-render/context'

export type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | number
  | Type<TProps>
  | FlexRenderComponent<TProps>
  | TemplateRef<{ $implicit: TProps }>
  | null
  | Record<any, any>
  | undefined

export type FlexRenderInputContent<TProps extends NonNullable<unknown>> =
  | number
  | string
  | ((props: TProps) => FlexRenderContent<TProps>)
  | null
  | undefined

@Directive({
  selector: 'ng-template[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
  TValue extends CellData,
  TProps extends
    | NonNullable<unknown>
    | CellContext<TFeatures, TRowData, TValue>
    | HeaderContext<TFeatures, TRowData, TValue>,
> {
  readonly #flexRenderComponentFactory = new FlexRenderComponentFactory(
    inject(ViewContainerRef),
  )

  readonly inputContent: InputSignal<FlexRenderInputContent<TProps>> = input(
    undefined as FlexRenderInputContent<TProps>,
    { alias: 'flexRender' },
  )
  readonly content = linkedSignal(() => this.inputContent())

  readonly inputProps = input<TProps>({} as TProps, {
    alias: 'flexRenderProps',
  })
  readonly props = linkedSignal(() => this.inputProps())

  readonly inputInjector = input(inject(Injector), {
    alias: 'flexRenderInjector',
  })
  readonly injector = linkedSignal(() => this.inputInjector())

  readonly #viewContainerRef = inject(ViewContainerRef)
  readonly #templateRef = inject(TemplateRef)

  renderFlags = FlexRenderFlags.ViewFirstRender
  renderView: FlexRenderView<any> | null = null

  readonly #getLatestContentValue = () => {
    const content = this.content()
    const props = this.props()
    return typeof content !== 'function'
      ? content
      : runInInjectionContext(this.injector(), () => content(props))
  }

  readonly #latestContent = computed(() => this.#getLatestContentValue())

  #getContentValue = computed(() => {
    const latestContent = this.#latestContent()
    return mapToFlexRenderTypedContent(latestContent)
  })

  constructor() {
    const destroyRef = inject(DestroyRef)
    destroyRef.onDestroy(() => {
      if (this.#currentEffectRef) {
        this.#currentEffectRef.destroy()
        this.#currentEffectRef = null
      }
      if (this.renderView) {
        this.renderView.unmount()
        this.renderView = null
      }
    })

    let previousContent: FlexRenderInputContent<TProps>
    let previousProps: TProps

    effect(() => {
      const props = this.props()
      const content = this.content()

      if (!(this.renderFlags & FlexRenderFlags.ViewFirstRender)) {
        if (previousContent !== content) {
          this.renderFlags |= FlexRenderFlags.ContentChanged
        }
        if (previousProps !== props) {
          this.renderFlags |= FlexRenderFlags.PropsReferenceChanged
        }
      }

      untracked(() => this.update())

      if (FlexRenderFlags.ViewFirstRender & this.renderFlags) {
        this.renderFlags &= ~FlexRenderFlags.ViewFirstRender
      }

      previousContent = content
      previousProps = props
    })
  }

  private doCheck() {
    const latestContent = this.#getContentValue()
    if (latestContent.kind === 'null' || !this.renderView) {
      this.renderFlags |= FlexRenderFlags.ContentChanged
    } else {
      this.renderView.content = latestContent
      const { kind: previousKind } = this.renderView.previousContent
      if (latestContent.kind !== previousKind) {
        this.renderFlags |= FlexRenderFlags.ContentChanged
      }
    }
    this.update()
  }

  update() {
    if (
      this.renderFlags &
      (FlexRenderFlags.ContentChanged | FlexRenderFlags.ViewFirstRender)
    ) {
      this.render()
      return
    }

    if (this.renderFlags & FlexRenderFlags.PropsReferenceChanged) {
      if (this.renderView) this.renderView.updateProps(this.props())
      this.renderFlags &= ~FlexRenderFlags.PropsReferenceChanged
    }

    if (this.renderFlags & FlexRenderFlags.Dirty) {
      if (this.renderView) this.renderView.dirtyCheck()
      this.renderFlags &= ~FlexRenderFlags.Dirty
    }
  }

  #currentEffectRef: EffectRef | null = null

  render() {
    // When the view is recreated from scratch (content change or first render),
    // we have to destroy the current effect listener since it will be recreated
    // skipping the first call (FlexRenderFlags.RenderEffectChecked)
    if (this.#shouldRecreateEntireView() && this.#currentEffectRef) {
      this.#currentEffectRef.destroy()
      this.#currentEffectRef = null
      this.renderFlags &= ~FlexRenderFlags.RenderEffectChecked
    }

    this.#viewContainerRef.clear()
    if (this.renderView) {
      this.renderView.unmount()
      this.renderView = null
    }

    this.renderFlags =
      (this.renderFlags & FlexRenderFlags.ViewFirstRender) |
      (this.renderFlags & FlexRenderFlags.RenderEffectChecked)

    const resolvedContent = this.#getContentValue()
    this.renderView = this.#renderViewByContent(resolvedContent)
    // If the content is a function `content(props)`, we initialize an effect
    // to react to changes. If the current fn uses signals, we will set the DirtySignal flag
    // to re-schedule the component updates
    if (
      !this.#currentEffectRef &&
      typeof untracked(this.content) === 'function'
    ) {
      this.#currentEffectRef = effect(
        () => {
          this.#latestContent()
          if (!(this.renderFlags & FlexRenderFlags.RenderEffectChecked)) {
            this.renderFlags |= FlexRenderFlags.RenderEffectChecked
            return
          }
          this.renderFlags |= FlexRenderFlags.Dirty
          this.doCheck()
        },
        { injector: this.#viewContainerRef.injector },
      )
    }
  }

  #shouldRecreateEntireView() {
    return (
      this.renderFlags &
      FlexRenderFlags.ContentChanged &
      FlexRenderFlags.ViewFirstRender
    )
  }

  #renderViewByContent(
    content: FlexRenderTypedContent,
  ): FlexRenderView<any> | null {
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
      const content = this.content()
      return typeof content === 'string' || typeof content === 'number'
        ? content
        : content?.(this.props())
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
    const latestContext = () => this.props()
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
      inputs: this.props(),
      injector: this.#getInjector(this.injector()),
    })
    const view = this.#flexRenderComponentFactory.createComponent(
      instance,
      this.injector(),
    )
    return new FlexRenderComponentView(component, view)
  }

  #getInjector(parentInjector?: Injector) {
    const getContext = () => this.props()
    const proxy = new Proxy(this.props(), {
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
      parent: parentInjector ?? this.injector(),
      providers: [
        ...staticProviders,
        { provide: FlexRenderComponentProps, useValue: proxy },
      ],
    })
  }
}
