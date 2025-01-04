import {
  computed,
  Directive,
  DoCheck,
  effect,
  Inject,
  inject,
  Injector,
  Input,
  OnChanges,
  runInInjectionContext,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core'
import { FlexRenderComponentProps } from './flex-render/context'
import { FlexRenderFlags } from './flex-render/flags'
import { FlexRenderComponent } from './flex-render/flex-render-component'
import { FlexRenderComponentFactory } from './flex-render/flex-render-component-ref'
import {
  FlexRenderComponentView,
  FlexRenderTemplateView,
  type FlexRenderTypedContent,
  FlexRenderView,
  mapToFlexRenderTypedContent,
} from './flex-render/view'

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
  | Record<string, any>
  | undefined

@Directive({
  selector: '[flexRender]',
  standalone: true,
  providers: [FlexRenderComponentFactory],
})
export class FlexRenderDirective<TProps extends NonNullable<unknown>>
  implements OnChanges, DoCheck
{
  @Input({ required: true, alias: 'flexRender' })
  content:
    | number
    | string
    | ((props: TProps) => FlexRenderContent<TProps>)
    | null
    | undefined = undefined

  @Input({ required: true, alias: 'flexRenderProps' })
  props: TProps = {} as TProps

  @Input({ required: false, alias: 'flexRenderInjector' })
  injector: Injector = inject(Injector)

  readonly #flexRenderComponentFactory = inject(FlexRenderComponentFactory)
  renderFlags = FlexRenderFlags.Creation
  renderView: FlexRenderView<any> | null = null

  constructor(
    @Inject(ViewContainerRef)
    private readonly viewContainerRef: ViewContainerRef,
    @Inject(TemplateRef)
    private readonly templateRef: TemplateRef<any>
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['props']) {
      this.renderFlags |= FlexRenderFlags.PropsReferenceChanged
    }
    if (changes['content']) {
      this.renderFlags |= FlexRenderFlags.ContentChanged
      this.checkView()
    }
  }

  ngDoCheck(): void {
    if (this.renderFlags & FlexRenderFlags.Creation) {
      // On the initial render, the view is created during the `ngOnChanges` hook.
      // Since `ngDoCheck` is called immediately afterward, there's no need to check for changes in this phase.
      this.renderFlags &= ~FlexRenderFlags.Creation
      return
    }

    // TODO: Optimization for V9?. We could check for signal changes when
    //  we have a way to detect here whether the table state changes
    // if (
    //   !(
    //     (this.renderFlags & FlexRenderFlags.DirtySignal) |
    //     FlexRenderFlags.PropsReferenceChanged
    //   )
    // ) {
    //   return
    // }

    const contentToRender = this.#getContentValue(this.props)

    if (contentToRender.kind === 'null' || !this.renderView) {
      this.renderFlags |= FlexRenderFlags.Creation
    } else {
      this.renderView.setContent(contentToRender.content)
      this.renderFlags |= FlexRenderFlags.DirtyCheck

      const previousContentInfo = this.renderView.previousContent
      if (contentToRender.kind !== previousContentInfo.kind) {
        this.renderFlags |= FlexRenderFlags.ContentChanged
      }
      this.renderFlags &= ~FlexRenderFlags.Pristine
    }

    this.checkView()
  }

  checkView() {
    if (
      this.renderFlags &
      (FlexRenderFlags.ContentChanged | FlexRenderFlags.Creation)
    ) {
      this.render()
      return
    }

    if (this.renderFlags & FlexRenderFlags.PropsReferenceChanged) {
      if (this.renderView) this.renderView.updateProps(this.props)
      this.renderFlags &= ~FlexRenderFlags.PropsReferenceChanged
    }

    if (this.renderFlags & FlexRenderFlags.DirtyCheck) {
      if (this.renderView) this.renderView.dirtyCheck()
      this.renderFlags &= ~(
        FlexRenderFlags.DirtyCheck | FlexRenderFlags.DirtySignal
      )
    }
  }

  render() {
    this.viewContainerRef.clear()
    const resolvedContent = this.#getContentValue(this.props)

    if (resolvedContent.kind === 'null') {
      this.renderView = null
      return
    }

    this.renderView = this.#renderViewByContent(resolvedContent)

    if (typeof this.content === 'function') {
      const effectRef = effect(
        () => {
          void resolvedContent.reactiveValue()
          if (this.renderFlags & FlexRenderFlags.Pristine) {
            this.renderFlags &= ~FlexRenderFlags.Pristine
            return
          }
          this.renderFlags |= FlexRenderFlags.DirtySignal
        },
        {
          injector: this.injector,
        }
      )
      if (this.renderView) {
        this.renderView.onDestroy(() => {
          effectRef.destroy()
        })
      }
    }

    this.renderFlags |= FlexRenderFlags.Pristine
    this.renderFlags &= ~FlexRenderFlags.ContentChanged
  }

  #renderViewByContent(
    content: FlexRenderTypedContent
  ): FlexRenderView<any> | null {
    if (content.kind === 'primitive') {
      return this.#renderStringContent()
    } else if (content.kind === 'templateRef') {
      return this.#renderTemplateRefContent(content.content)
    } else if (content.kind === 'flexRenderComponent') {
      return this.#renderComponent(content.content)
    } else if (content.kind === 'component') {
      return this.#renderCustomComponent(content.content)
    } else {
      return null
    }
  }

  #renderStringContent(): FlexRenderTemplateView {
    const context = () => {
      return typeof this.content === 'string' ||
        typeof this.content === 'number'
        ? this.content
        : this.content?.(this.props)
    }
    const ref = this.viewContainerRef.createEmbeddedView(this.templateRef, {
      get $implicit() {
        return context()
      },
    })
    return new FlexRenderTemplateView(context(), ref)
  }

  #renderTemplateRefContent(content: TemplateRef<any>): FlexRenderTemplateView {
    const latestContext = () => this.props
    const view = this.viewContainerRef.createEmbeddedView(content, {
      get $implicit() {
        return latestContext()
      },
    })
    return new FlexRenderTemplateView(content, view)
  }

  #renderComponent(
    flexRenderComponent: FlexRenderComponent
  ): FlexRenderComponentView {
    const { inputs, injector } = flexRenderComponent

    const getContext = () => this.props
    const proxy = new Proxy(this.props, {
      get: (_, key) => getContext()[key as keyof typeof _],
    })
    const componentInjector = Injector.create({
      parent: injector ?? this.injector,
      providers: [{ provide: FlexRenderComponentProps, useValue: proxy }],
    })
    const view = this.#flexRenderComponentFactory.createComponent(
      flexRenderComponent,
      componentInjector
    )
    if (inputs) {
      view.setInputs(inputs)
    }
    return new FlexRenderComponentView(flexRenderComponent, view)
  }

  #renderCustomComponent(component: Type<unknown>): FlexRenderComponentView {
    const view = this.#flexRenderComponentFactory.createComponent(
      new FlexRenderComponent(component, this.props),
      this.injector
    )
    view.setInputs({ ...this.props })
    return new FlexRenderComponentView(component, view)
  }

  #getContentValue(context: TProps) {
    const content = this.content
    const result =
      typeof content !== 'function'
        ? content
        : runInInjectionContext(this.injector, () => content(context))
    return Object.assign(mapToFlexRenderTypedContent(result), {
      reactiveValue: computed(() =>
        typeof content !== 'function'
          ? content
          : runInInjectionContext(this.injector, () => content(context))
      ),
    })
  }
}
