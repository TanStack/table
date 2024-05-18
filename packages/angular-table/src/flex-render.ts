import {
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  InjectionToken,
  Injector,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  type Type,
} from '@angular/core'

type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | number
  | FlexRenderComponent<TProps>
  | TemplateRef<{ $implicit: TProps }>
  | null

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<TProps extends NonNullable<unknown>> {
  // set the type to unknown as input signal is not able to recognize the types correctly
  // which causes build error
  content = input.required<unknown>({ alias: 'flexRender' })

  props = input<TProps>({} as TProps, { alias: 'flexRenderProps' })

  injector = input(inject(Injector), { alias: 'flexRenderInjector' })

  viewContainerRef = inject(ViewContainerRef)
  templateRef = inject(TemplateRef<any>)

  constructor() {
    effect(() => this.render())
  }

  render() {
    this.viewContainerRef.clear()
    const content = this.content()
    if (!content) {
      return null
    }

    if (typeof content === 'function') {
      return this.renderContent(content(this.props()))
    }
    return this.renderStringContent()
  }

  private renderContent(content: FlexRenderContent<TProps>) {
    if (content instanceof TemplateRef) {
      return this.viewContainerRef.createEmbeddedView(
        content,
        this.getTemplateRefContext()
      )
    } else if (content instanceof FlexRenderComponent) {
      return this.renderComponent(content)
    } else if (content) {
      return this.renderStringContent()
    } else {
      return null
    }
  }

  private renderStringContent(): EmbeddedViewRef<unknown> {
    const context = () => {
      const content = this.content()
      return typeof content === 'function' ? content?.(this.props()) : content
    }
    return this.viewContainerRef.createEmbeddedView(this.templateRef, {
      get $implicit() {
        return context()
      },
    })
  }

  private renderComponent(
    flexRenderComponent: FlexRenderComponent<TProps>
  ): ComponentRef<unknown> {
    const { component, inputs, injector } = flexRenderComponent

    const getContext = () => this.props()

    const proxy = new Proxy(this.props(), {
      get: (_, key) => getContext()?.[key as keyof typeof _],
    })

    const componentInjector = Injector.create({
      parent: injector ?? this.injector(),
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

  private getTemplateRefContext() {
    const getContext = () => this.props()
    return {
      get $implicit() {
        return getContext()
      },
    }
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
