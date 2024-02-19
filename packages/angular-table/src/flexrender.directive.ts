import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective implements OnInit {
  // private vcr = inject(ViewContainerRef)
  // private templateRef = inject(TemplateRef)

  private _flexRender: any

  /** properties to render */
  private _flexRenderProps: any

  @Input({ required: true })
  set flexRender(render: any) {
    this._flexRender = render
  }

  @Input({ required: true })
  set flexRenderProps(props: any) {
    this._flexRenderProps = props
  }

  constructor(
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    // This ensures that if the 'flexRender' input is set before the directive initializes,
    // the component will be rendered when ngOnInit is called.
    if (this._flexRender) {
      this.renderComponent()
    }
  }

  renderComponent() {
    this.vcr.clear()
    if (!this._flexRender) {
      return null
    }
    if (typeof this._flexRender === 'string') {
      return this.vcr.createEmbeddedView(this.templateRef, {
        $implicit: this._flexRender,
      })
    } else if (typeof this._flexRender === 'function') {
      const componentInstance = this._flexRender(this._flexRenderProps)
      return this.vcr.createEmbeddedView(this.templateRef, {
        $implicit: componentInstance,
      })
    }
    return null
  }
}
