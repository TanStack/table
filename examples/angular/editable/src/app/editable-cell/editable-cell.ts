import { Component, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'editable-cell',
  template: `
    <input
      [ngModel]="value()"
      [ngModelOptions]="{ updateOn: 'blur' }"
      (ngModelChange)="change.emit($event)"
    />
  `,
  imports: [FormsModule],
})
export class EditableCell {
  readonly value = input<unknown>()

  readonly change = output<unknown>()
}
