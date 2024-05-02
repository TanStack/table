import {
  Directive,
  Input,
  type OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<TProps> implements OnInit {
  @Input({ required: true })
  flexRender!: any | ((props: any) => any)

  @Input({ required: true })
  flexRenderProps!: any

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this.renderComponent()
  }

  renderComponent() {
    this.viewContainerRef.clear()
    if (!this.flexRender) {
      return null
    }
    if (typeof this.flexRender === 'string') {
      const getContext = () => this.flexRender
      this.viewContainerRef.createEmbeddedView(this.templateRef, {
        get $implicit() {
          return getContext()
        },
      })
    } else if (typeof this.flexRender === 'function') {
      const getContext = () => this.flexRender(this.flexRenderProps)
      this.viewContainerRef.createEmbeddedView(this.templateRef, {
        get $implicit() {
          return getContext()
        },
      })
    }
  }
}
