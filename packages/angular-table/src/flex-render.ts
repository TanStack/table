import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  EffectRef,
  Injector,
  OnChanges,
  Provider,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  runInInjectionContext,
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
import type { InputSignal } from '@angular/core'
import type { FlexRenderTypedContent } from './flex-render/view'
import type {
  CellContext,
  CellData,
  HeaderContext,
  RowData,
  Table,
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

@Directive({
  selector: 'ng-template[flexRender]',
  standalone: true,
})
export class FlexRender<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
  TValue extends CellData,
  TProps extends
    | NonNullable<unknown>
    | CellContext<TFeatures, TRowData, TValue>
    | HeaderContext<TFeatures, TRowData, TValue>,
>
  implements DoCheck, OnChanges
{
  readonly #flexRenderComponentFactory = new FlexRenderComponentFactory(
    inject(ViewContainerRef),
  )
  readonly #changeDetectorRef = inject(ChangeDetectorRef)

  readonly inputContent: InputSignal<
    | number
    | string
    | ((props: TProps) => FlexRenderContent<TProps>)
    | null
    | undefined
  > = input(undefined as any, {
    alias: 'flexRender',
  })
  readonly content = linkedSignal(() => this.inputContent())

  readonly inputProps = input<TProps>({} as TProps, {
    alias: 'flexRenderProps',
  })
  readonly props = linkedSignal(() => this.inputProps())

  readonly inputNotifier = input<'doCheck' | 'tableChange'>('doCheck', {
    alias: 'flexRenderNotifier',
  })
  readonly notifier = linkedSignal(() => this.inputNotifier())

  readonly #injector = inject(Injector)
  readonly inputInjector = input(this.#injector, {
    alias: 'flexRenderInjector',
  })
  readonly injector = linkedSignal(() => this.inputInjector())

  readonly inputStaticProviders = input<Array<Provider>>([], {
    alias: 'flexRenderStaticProviders',
  })
  readonly staticProviders = linkedSignal(() => this.inputStaticProviders())

  readonly viewContainerRef = inject(ViewContainerRef)

  readonly templateRef = inject(TemplateRef)

  table: Table<TFeatures, TRowData> | null = null
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

  ngOnChanges(
    changes: SimpleChanges<FlexRender<TFeatures, TRowData, TValue, TProps>>,
  ) {
    if (changes.inputProps) {
      const props = changes.inputProps.currentValue
      this.table = 'table' in props ? props.table : null
      this.renderFlags |= FlexRenderFlags.PropsReferenceChanged
      this.bindTableDirtyCheck()
    }
    if (changes.inputContent) {
      this.renderFlags |=
        FlexRenderFlags.ContentChanged | FlexRenderFlags.ViewFirstRender
      this.update()
    }
  }

  ngDoCheck(): void {
    if (this.renderFlags & FlexRenderFlags.ViewFirstRender) {
      // On the initial render, the view is created during the `ngOnChanges` hook.
      // Since `ngDoCheck` is called immediately afterward, there's no need to check for changes in this phase.
      this.renderFlags &= ~FlexRenderFlags.ViewFirstRender
      return
    }

    if (this.notifier() === 'doCheck') {
      this.renderFlags |= FlexRenderFlags.DirtyCheck
      this.doCheck()
    }
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

  #tableChangeEffect: EffectRef | null = null

  private bindTableDirtyCheck() {
    this.#tableChangeEffect?.destroy()
    this.#tableChangeEffect = null
    let firstCheck = !!(this.renderFlags & FlexRenderFlags.ViewFirstRender)
    if (this.table && this.notifier() === 'tableChange') {
      const table = this.table
      this.#tableChangeEffect = effect(
        () => {
          table.get()
          if (firstCheck) {
            firstCheck = false
            return
          }
          this.renderFlags |= FlexRenderFlags.DirtyCheck
          this.doCheck()
        },
        { injector: this.#injector },
      )
    }
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
    if (
      this.renderFlags &
      (FlexRenderFlags.DirtyCheck | FlexRenderFlags.DirtySignal)
    ) {
      if (this.renderView) this.renderView.dirtyCheck()
      this.renderFlags &= ~(
        FlexRenderFlags.DirtyCheck | FlexRenderFlags.DirtySignal
      )
    }
  }

  #currentEffectRef: EffectRef | null = null

  render() {
    if (this.#shouldRecreateEntireView() && this.#currentEffectRef) {
      this.#currentEffectRef.destroy()
      this.#currentEffectRef = null
      this.renderFlags &= ~FlexRenderFlags.RenderEffectChecked
    }

    this.viewContainerRef.clear()
    if (this.renderView) {
      this.renderView.unmount()
      this.renderView = null
    }

    this.renderFlags =
      FlexRenderFlags.Pristine |
      (this.renderFlags & FlexRenderFlags.ViewFirstRender) |
      (this.renderFlags & FlexRenderFlags.RenderEffectChecked)

    const resolvedContent = this.#getContentValue()
    if (resolvedContent.kind === 'null') {
      this.renderView = null
    } else {
      this.renderView = this.#renderViewByContent(resolvedContent)
    }

    // If the content is a function `content(props)`, we initialize an effect
    // in order to react to changes if the given definition use signals.
    if (!this.#currentEffectRef && typeof this.content === 'function') {
      this.#currentEffectRef = effect(
        () => {
          this.#latestContent()
          if (!(this.renderFlags & FlexRenderFlags.RenderEffectChecked)) {
            this.renderFlags |= FlexRenderFlags.RenderEffectChecked
            return
          }
          this.renderFlags |= FlexRenderFlags.DirtySignal
          // This will mark the view as changed,
          // so we'll try to check for updates into ngDoCheck
          this.#changeDetectorRef.markForCheck()
        },
        { injector: this.viewContainerRef.injector },
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
    const ref = this.viewContainerRef.createEmbeddedView(this.templateRef, {
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
    const view = this.viewContainerRef.createEmbeddedView(template.content, {
      get $implicit() {
        return latestContext()
      },
    })
    return new FlexRenderTemplateView(template, view)
  }

  #renderComponent(
    flexRenderComponent: Extract<
      FlexRenderTypedContent,
      { kind: 'flexRenderComponent' }
    >,
  ): FlexRenderComponentView {
    const { injector } = flexRenderComponent.content
    const componentInjector = this.#getComponentInjector(injector)
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
      injector: this.#getComponentInjector(this.injector()),
    })
    const view = this.#flexRenderComponentFactory.createComponent(
      instance,
      this.injector(),
    )
    return new FlexRenderComponentView(component, view)
  }

  #getComponentInjector(parentInjector?: Injector) {
    const getContext = () => this.props()
    const proxy = new Proxy(this.props(), {
      get: (_, key) => getContext()[key as keyof typeof _],
    })
    return Injector.create({
      parent: parentInjector ?? this.injector(),
      providers: [
        ...this.staticProviders(),
        { provide: FlexRenderComponentProps, useValue: proxy },
      ],
    })
  }
}

/**
 * @deprecated Use `FlexRender` import instead.
 * @alias FlexRender
 */
export const FlexRenderDirective = FlexRender
