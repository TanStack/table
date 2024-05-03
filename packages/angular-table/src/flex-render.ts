import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  type DoCheck,
  EmbeddedViewRef,
  inject,
  InjectionToken,
  Injector,
  Input,
  type OnInit,
  TemplateRef,
  type Type,
  ViewContainerRef,
} from '@angular/core'

type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | FlexRenderComponent<TProps>
  | TemplateRef<{ $implicit: TProps }>

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<TProps extends NonNullable<unknown>>
  implements OnInit, DoCheck
{
  @Input({ required: true, alias: 'flexRender' })
  content: string | ((props: TProps) => FlexRenderContent<TProps>) | undefined =
    undefined

  @Input({ required: true, alias: 'flexRenderProps' })
  props: TProps = {} as TProps

  @Input({ required: false, alias: 'flexRenderInjector' })
  injector: Injector = inject(Injector)

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ref?: ComponentRef<any> | EmbeddedViewRef<any> | null = null

  ngOnInit(): void {
    this.ref = this.render()
  }

  ngDoCheck() {
    if (this.ref instanceof ComponentRef) {
      this.ref.injector.get(ChangeDetectorRef).markForCheck()
    }
  }

  render() {
    this.viewContainerRef.clear()
    const { content, props } = this
    if (!this.content) {
      return null
    }

    if (typeof content === 'string') {
      return this.viewContainerRef.createEmbeddedView(this.templateRef, {
        get $implicit() {
          return content
        },
      })
    }
    if (typeof content === 'function') {
      return this.renderContent(content(props))
    }
    return null
  }

  private renderContent(content: FlexRenderContent<TProps>) {
    if (typeof content === 'string') {
      return this.viewContainerRef.createEmbeddedView(this.templateRef, {
        get $implicit() {
          return content
        },
      })
    }
    if (content instanceof TemplateRef) {
      const props = () => this.props
      return this.viewContainerRef.createEmbeddedView(content, {
        get $implicit() {
          return props()
        },
      })
    }
    return this.renderComponent(content)
  }

  private renderComponent(flexRenderComponent: FlexRenderComponent<TProps>) {
    const { component, inputs, injector } = flexRenderComponent

    const getContext = () => this.props

    const proxy = new Proxy(this.props, {
      get: (_, key) => getContext()?.[key as keyof typeof _],
    })

    const componentInjector = Injector.create({
      parent: injector ?? this.injector,
      providers: [{ provide: FlexRenderComponentProps, useValue: proxy }],
    })

    const componentRef = this.viewContainerRef.createComponent(component, {
      injector: componentInjector,
    })
    for (const prop in inputs) {
      if (componentRef.instance?.hasOwnProperty(prop)) {
        componentRef.setInput(prop, inputs[prop])
      }
    }
    return componentRef
  }
}

export class FlexRenderComponent<T extends NonNullable<unknown>> {
  constructor(
    readonly component: Type<unknown>,
    readonly inputs: T = {} as T,
    readonly injector?: Injector
  ) {}
}

const FlexRenderComponentProps = new InjectionToken<NonNullable<unknown>>(
  '[@tanstack/angular-table] Flex render component context props'
)

export function injectFlexRenderContext<T extends NonNullable<unknown>>(): T {
  return inject<T>(FlexRenderComponentProps)
}
