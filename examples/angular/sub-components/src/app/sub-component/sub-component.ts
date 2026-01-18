import { Component, input } from '@angular/core'
import { JsonPipe } from '@angular/common'
import type { Row } from '@tanstack/angular-table'

@Component({
  selector: 'app-sub',
  template: `
    <pre [style.font-size.px]="10" class="bg-gray-100">
    <code>
      {{ row().original | json }}
    </code>
  </pre>
  `,
  imports: [JsonPipe],
})
export class SubComponent {
  readonly row = input.required<Row<any, any>>()
}
