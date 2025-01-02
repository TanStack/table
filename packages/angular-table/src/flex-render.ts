import {
  ComponentMirror,
  ComponentRef,
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Inject,
  InjectionToken,
  Injector,
  Input,
  InputSignal,
  OnChanges,
  OutputEmitterRef,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
  inject,
  isSignal,
  reflectComponentType,
  runInInjectionContext,
} from '@angular/core'
import {
  FlexRenderComponentFactory,
  FlexRenderComponentRef,
} from './flex-render-component-ref'

export type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | number
  | Type<TProps>
  | FlexRenderComponent<TProps>
  | TemplateRef<{ $implicit: TProps }>
  | null
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

  ref?:
    | FlexRenderComponentRef<any>
    | ComponentRef<unknown>
    | EmbeddedViewRef<unknown>
    | null = null

  #isFirstRender = true
  #lastContentChecked: FlexRenderContent<TProps> | null = null

  readonly #flexRenderComponentFactory = inject(FlexRenderComponentFactory)

  constructor(
    @Inject(ViewContainerRef)
    private readonly viewContainerRef: ViewContainerRef,
    @Inject(TemplateRef)
    private readonly templateRef: TemplateRef<any>
  ) {}

  ngDoCheck(): void {
    if (this.#isFirstRender) {
      this.#isFirstRender = false
      return
    }
    this.rerender()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['content']) {
      return
    }
    this.render()
  }

  render() {
    console.log('Trigger render')
    this.viewContainerRef.clear()
    const { content, props } = this
    if (content === null || content === undefined) {
      this.ref = null
      this.#lastContentChecked = null
      return
    }

    const resolvedContent = this.#getContentValue(props)
    this.ref = this.renderContent(resolvedContent)
    this.#lastContentChecked = resolvedContent
  }

  rerender(): void {
    const { props } = this
    const currentContent = this.#getContentValue(props)

    if (this.#lastContentChecked !== currentContent) {
      // Every time the component is checked for changes,
      // we manually have to check if the given cell value differs, as the user passes only a reference to the header/row cell definition.
      const currentContentType = this.#getContentType(currentContent)
      const previousContentType = this.#getContentType(this.#lastContentChecked)

      if (currentContentType !== previousContentType) {
        this.render()
      }

      switch (currentContentType) {
        case 'object':
        case 'templateRef':
        case 'component':
        case 'primitive': {
          // Basically a noop. Currently in all of these cases, if the given instance differs than the previous one,
          // we don't need any manual update since this type of content is rendered
          // with an EmbeddedViewRef with a proxy as context, then every time the root component is checked for changes,
          // the getter will be revaluated.
          break
        }
        case 'flexRenderComponent': {
          if (currentContent instanceof FlexRenderComponent) {
            // the given content instance will always have a different reference that previous one,
            // then in that case instead of recreating the entire view, we will only update what changes
            if (
              this.ref instanceof FlexRenderComponentRef &&
              this.ref.eq(currentContent)
            ) {
              this.ref.update(currentContent)
            }
            break
          }
        }
      }

      if (
        currentContentType === 'primitive' &&
        previousContentType === 'primitive'
      ) {
        // Basically a noop. Primitive content doesn't need any manual update since that type of content it's rendered with an EmbebbedViewRef with
        // a getter as a context, then it will be revaluated during change detection cycle.
      } else if (
        currentContentType === 'flexRenderComponent' &&
        previousContentType === 'flexRenderComponent' &&
        currentContent instanceof FlexRenderComponent
      ) {
        // New FlexRenderComponent will always have a different reference that previous one,
        // then in that case instead of recreating the entire view, we will only update what changes
        if (
          this.ref instanceof FlexRenderComponentRef &&
          this.ref.eq(currentContent)
        ) {
          this.ref.update(currentContent)
        }
      } else {
        this.render()
      }
    }

    this.#lastContentChecked = currentContent
  }

  private renderContent(content: FlexRenderContent<TProps>) {
    if (typeof content === 'string' || typeof content === 'number') {
      return this.renderStringContent()
    }
    if (content instanceof TemplateRef) {
      return this.viewContainerRef.createEmbeddedView(
        content,
        this.getTemplateRefContext()
      )
    } else if (content instanceof FlexRenderComponent) {
      return this.renderComponent(content)
    } else if (content instanceof Type) {
      return this.renderCustomComponent(content)
    } else {
      return null
    }
  }

  private renderStringContent(): EmbeddedViewRef<unknown> {
    const context = () => {
      return typeof this.content === 'string' ||
        typeof this.content === 'number'
        ? this.content
        : this.content?.(this.props)
    }
    return this.viewContainerRef.createEmbeddedView(this.templateRef, {
      get $implicit() {
        return context()
      },
    })
  }

  private renderComponent(
    flexRenderComponent: FlexRenderComponent
  ): FlexRenderComponentRef<unknown> {
    const { inputs, injector } = flexRenderComponent

    const getContext = () => this.props
    const proxy = new Proxy(this.props, {
      get: (_, key) => getContext()[key as keyof typeof _],
    })
    const componentInjector = Injector.create({
      parent: injector ?? this.injector,
      providers: [{ provide: FlexRenderComponentProps, useValue: proxy }],
    })

    const ref = this.#flexRenderComponentFactory.createComponent(
      flexRenderComponent,
      componentInjector
    )
    if (inputs) {
      ref.setInputs(inputs)
    }

    return ref
  }

  private renderCustomComponent(
    component: Type<unknown>
  ): ComponentRef<unknown> {
    const componentRef = this.viewContainerRef.createComponent(component, {
      injector: this.injector,
    })
    for (const prop in this.props) {
      // Only signal based input can be added here
      if (
        componentRef.instance?.hasOwnProperty(prop) &&
        // @ts-ignore - unknown error
        isSignal(componentRef.instance[prop])
      ) {
        componentRef.setInput(prop, this.props[prop])
      }
    }
    return componentRef
  }

  private getTemplateRefContext() {
    const getContext = () => this.props
    return {
      get $implicit() {
        return getContext()
      },
    }
  }

  #getContentValue(context: TProps) {
    const content = this.content
    return typeof content !== 'function'
      ? content
      : runInInjectionContext(this.injector, () => content(context))
  }

  #getContentType(
    content: FlexRenderContent<TProps>
  ):
    | 'primitive'
    | 'flexRenderComponent'
    | 'component'
    | 'templateRef'
    | 'object'
    | null {
    if (content === null || content === undefined) {
      return null
    }
    const type = typeof content
    const isPrimitive =
      type === 'string' ||
      type === 'number' ||
      type === 'boolean' ||
      type === 'bigint' ||
      type === 'symbol'
    if (isPrimitive) {
      return 'primitive'
    }
    let currentType:
      | 'object'
      | 'flexRenderComponent'
      | 'component'
      | 'templateRef' = 'object'
    if (type === 'object') {
      if (content instanceof FlexRenderComponent) {
        currentType = 'flexRenderComponent'
      } else if (content instanceof TemplateRef) {
        currentType = 'templateRef'
      } else if (content instanceof Type) {
        currentType = 'component'
      }
    }
    return currentType
  }
}

type Inputs<T> = {
  [K in keyof T as T[K] extends InputSignal<infer R>
    ? K
    : never]: T[K] extends InputSignal<infer R> ? R : never
}

type Outputs<T> = {
  [K in keyof T as T[K] extends OutputEmitterRef<infer R>
    ? K
    : never]: T[K] extends OutputEmitterRef<infer R> ? (v: R) => void : never
}

export class FlexRenderComponent<TComponent = any> {
  readonly mirror: ComponentMirror<TComponent>
  readonly allowedInputNames: string[] = []

  constructor(
    readonly component: Type<TComponent>,
    readonly inputs?: Inputs<TComponent>,
    readonly injector?: Injector
  ) {
    const mirror = reflectComponentType(component)
    if (!mirror) {
      throw new Error(
        `[@tanstack-table/angular] The provided symbol is not a component`
      )
    }
    this.mirror = mirror
    for (const input of this.mirror.inputs) {
      this.allowedInputNames.push(input.propName)
    }
  }
}

export const FlexRenderComponentProps = new InjectionToken<
  NonNullable<unknown>
>('[@tanstack/angular-table] Flex render component context props')

export function injectFlexRenderContext<T extends NonNullable<unknown>>(): T {
  return inject<T>(FlexRenderComponentProps)
}
