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
    this.#checkChanges()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['content']) {
      return
    }
    this.render()
  }

  render() {
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

  #checkChanges(): void {
    const currentContent = this.#getContentValue(this.props)
    if (Object.is(this.#lastContentChecked, currentContent)) {
      this.#lastContentChecked = currentContent
      // NOTE: currently this is like having a component with ChangeDetectionStrategy.Default.
      // In this case updating input values is just a noop since the instance of the context properties (table, cell, etc...) doesn't change,
      // but marking the view as dirty allows to re-evaluate all function invocation on the component template.
      if (this.ref instanceof FlexRenderComponentRef) {
        this.ref.markAsDirty()
      }
    }

    // When the content reference (or value, for primitive values) differs, we need to detect the `type` of the
    // new content in order to apply a specific update strategy.
    const contentInfo = this.#getContentInfo(currentContent)
    const previousContentInfo = this.#getContentInfo(this.#lastContentChecked)
    if (contentInfo.kind !== previousContentInfo.kind) {
      this.#lastContentChecked = currentContent
      this.render()
      return
    }

    switch (contentInfo.kind) {
      case 'object':
      case 'templateRef':
      case 'primitive': {
        // Basically a no-op. Currently in all of those cases, we don't need to do any manual update
        // since this type of content is rendered with an EmbeddedViewRef with a proxy as a context,
        // then every time the root component is checked for changes, the getter will be revaluated.
        break
      }
      case 'component': {
        // Here updating the instance input values is a no-op since the instance of the context properties (table, cell, etc...) doesn't change,
        // but marking the view as dirty allows to re-evaluate all invokation in the component template.
        if (this.ref instanceof FlexRenderComponentRef) {
          this.ref.componentRef.changeDetectorRef.markForCheck()
        }
        break
      }
      case 'flexRenderComponent': {
        // the given content instance will always have a different reference that previous one,
        // then in that case instead of recreating the entire view, we will only update what changes
        if (
          this.ref instanceof FlexRenderComponentRef &&
          this.ref.eq(contentInfo.content)
        ) {
          this.ref.update(contentInfo.content)
        }
        break
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
  ): FlexRenderComponentRef<unknown> {
    const ref = this.#flexRenderComponentFactory.createComponent(
      new FlexRenderComponent(component, this.props),
      this.injector
    )
    ref.setInputs({ ...this.props })
    return ref
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

  #getContentInfo(content: FlexRenderContent<TProps>):
    | { kind: 'null' }
    | {
        kind: 'primitive'
        content: string | number | bigint | symbol
      }
    | { kind: 'flexRenderComponent'; content: FlexRenderComponent<unknown> }
    | { kind: 'templateRef'; content: TemplateRef<unknown> }
    | { kind: 'component'; content: Type<unknown> }
    | { kind: 'object'; content: unknown } {
    if (content === null || content === undefined) {
      return { kind: 'null' }
    }
    if (
      typeof content === 'string' ||
      typeof content === 'number' ||
      typeof content === 'boolean' ||
      typeof content === 'bigint' ||
      typeof content === 'symbol'
    ) {
      return { kind: 'primitive', content }
    }
    if (content instanceof FlexRenderComponent) {
      return { kind: 'flexRenderComponent', content }
    } else if (content instanceof TemplateRef) {
      return { kind: 'templateRef', content }
    } else if (content instanceof Type) {
      return { kind: 'component', content }
    } else {
      return { kind: 'object', content }
    }
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
