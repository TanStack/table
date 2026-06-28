import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  untracked,
} from '@angular/core'
import { TanStackField, injectForm, injectStore } from '@tanstack/angular-form'
import { blankRow, personSchema } from './schema'
import type { features } from './table'
import type { DeepKeys } from '@tanstack/angular-form'
import type { FormRow } from './schema'
import type { Row } from '@tanstack/angular-table'

@Component({
  selector: 'tr[appRowSubmitTableRow]',
  imports: [TanStackField],
  template: `
    @for (cell of row().getAllCells(); track cell.id) {
      <td>
        @switch (cell.column.id) {
          @case ('firstName') {
            <ng-container
              [tanstackField]="form"
              [name]="fieldName('firstName')"
              #field="field"
            >
              <input
                class="text-input"
                [value]="field.api.state.value"
                (input)="field.api.handleChange(textValue($event))"
                (blur)="field.api.handleBlur()"
              />
              @if (showErrors(field.api.state.meta)) {
                <div class="error-text">
                  {{ errorText(field.api.state.meta.errors) }}
                </div>
              }
            </ng-container>
          }
          @case ('lastName') {
            <ng-container
              [tanstackField]="form"
              [name]="fieldName('lastName')"
              #field="field"
            >
              <input
                class="text-input"
                [value]="field.api.state.value"
                (input)="field.api.handleChange(textValue($event))"
                (blur)="field.api.handleBlur()"
              />
              @if (showErrors(field.api.state.meta)) {
                <div class="error-text">
                  {{ errorText(field.api.state.meta.errors) }}
                </div>
              }
            </ng-container>
          }
          @case ('age') {
            <ng-container
              [tanstackField]="form"
              [name]="fieldName('age')"
              #field="field"
            >
              <input
                class="number-input"
                type="number"
                [value]="field.api.state.value"
                (input)="field.api.handleChange(numberValue($event))"
                (blur)="field.api.handleBlur()"
              />
              @if (showErrors(field.api.state.meta)) {
                <div class="error-text">
                  {{ errorText(field.api.state.meta.errors) }}
                </div>
              }
            </ng-container>
          }
          @case ('visits') {
            <ng-container
              [tanstackField]="form"
              [name]="fieldName('visits')"
              #field="field"
            >
              <input
                class="number-input"
                type="number"
                [value]="field.api.state.value"
                (input)="field.api.handleChange(numberValue($event))"
                (blur)="field.api.handleBlur()"
              />
              @if (showErrors(field.api.state.meta)) {
                <div class="error-text">
                  {{ errorText(field.api.state.meta.errors) }}
                </div>
              }
            </ng-container>
          }
          @case ('status') {
            <ng-container
              [tanstackField]="form"
              [name]="fieldName('status')"
              #field="field"
            >
              <select
                class="compact-input"
                [value]="field.api.state.value"
                (change)="field.api.handleChange(statusValue($event))"
                (blur)="field.api.handleBlur()"
              >
                <option value="relationship">relationship</option>
                <option value="complicated">complicated</option>
                <option value="single">single</option>
              </select>
              @if (showErrors(field.api.state.meta)) {
                <div class="error-text">
                  {{ errorText(field.api.state.meta.errors) }}
                </div>
              }
            </ng-container>
          }
          @case ('progress') {
            <ng-container
              [tanstackField]="form"
              [name]="fieldName('progress')"
              #field="field"
            >
              <input
                class="number-input"
                type="number"
                [value]="field.api.state.value"
                (input)="field.api.handleChange(numberValue($event))"
                (blur)="field.api.handleBlur()"
              />
              @if (showErrors(field.api.state.meta)) {
                <div class="error-text">
                  {{ errorText(field.api.state.meta.errors) }}
                </div>
              }
            </ng-container>
          }
          @case ('save') {
            <div class="row-action-cell">
              @if (formState().isDirty) {
                <button
                  type="button"
                  class="demo-button demo-button-sm primary-action"
                  [disabled]="
                    !formState().canSubmit || formState().isSubmitting
                  "
                  (click)="form.handleSubmit()"
                >
                  {{ formState().isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              }
            </div>
          }
        }
      </td>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowSubmitTableRow {
  readonly row = input.required<Row<typeof features, FormRow>>()
  readonly save =
    input.required<(originalRow: FormRow, value: FormRow) => void>()

  readonly form = injectForm({
    defaultValues: blankRow(),
    validators: {
      onChange: personSchema,
    },
    onSubmit: ({ value }) => {
      const originalRow = this.row().original
      this.save()(originalRow, value)
      this.form.reset(value)
    },
  })

  readonly formState = injectStore(this.form, (state) => ({
    canSubmit: state.canSubmit,
    isDirty: state.isDirty,
    isSubmitting: state.isSubmitting,
  }))

  constructor() {
    effect(() => {
      const original = this.row().original
      untracked(() => this.form.reset(original))
    })
  }

  fieldName(key: keyof FormRow): DeepKeys<FormRow> {
    return key
  }

  textValue(event: Event) {
    return (event.target as HTMLInputElement).value
  }

  numberValue(event: Event) {
    return Number((event.target as HTMLInputElement).value)
  }

  statusValue(event: Event) {
    return (event.target as HTMLSelectElement).value as FormRow['status']
  }

  showErrors(meta: {
    isBlurred: boolean
    isTouched: boolean
    errors: ReadonlyArray<unknown>
  }) {
    return (meta.isTouched || meta.isBlurred) && meta.errors.length > 0
  }

  errorText(errors: ReadonlyArray<unknown>) {
    return errors.map((error) => this.getErrorMessage(error)).join(', ')
  }

  getErrorMessage(error: unknown) {
    if (typeof error === 'string') return error

    if (error && typeof error === 'object' && 'message' in error) {
      const message = error.message
      if (typeof message === 'string') return message
    }

    return String(error)
  }
}
