import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Injector,
  inject,
  signal,
  untracked,
} from '@angular/core'
import { NgComponentOutlet } from '@angular/common'
import {
  FlexRender,
  TanStackTable,
  TanStackTableCell,
  TanStackTableHeader,
} from '@tanstack/angular-table'
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'
import { TanStackField, injectForm, injectStore } from '@tanstack/angular-form'
import { makeData } from './makeData'
import { RowSubmitTableRow } from './row-submit-table-row'
import { blankRow, formSchema } from './schema'
import { createAppColumnHelper, injectAppTable } from './table'
import type { FormData, FormRow } from './schema'
import type { DeepKeys } from '@tanstack/angular-form'

const columnHelper = createAppColumnHelper<FormRow>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  }),
])

const rowColumns = columnHelper.columns([
  ...columns,
  columnHelper.display({
    id: 'save',
    header: '',
    cell: () => null,
  }),
])

@Component({
  selector: 'app-root',
  imports: [
    FlexRender,
    NgComponentOutlet,
    RowSubmitTableRow,
    TanStackField,
    TanStackTable,
    TanStackTableCell,
    TanStackTableHeader,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly injector = inject(Injector)

  readonly data = signal<Array<FormRow>>(makeData(100))
  readonly rowData = signal<Array<FormRow>>(makeData(100))

  readonly fullTableForm = injectForm({
    defaultValues: {
      data: this.data(),
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      alert(
        `Submitted ${value.data.length} records!\n\nFirst record: ${JSON.stringify(value.data[0], null, 2)}`,
      )
    },
  })

  readonly fullFormState = injectStore(this.fullTableForm, (state) => ({
    canSubmit: state.canSubmit,
    isDirty: state.isDirty,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
  }))

  readonly table = injectAppTable<FormRow>(() => ({
    key: 'with-tanstack-form-full-table',
    columns,
    data: this.data(),
    debugTable: true,
  }))

  readonly rowTable = injectAppTable<FormRow>(() => ({
    key: 'with-tanstack-form-row-submit',
    columns: rowColumns,
    data: this.rowData(),
    debugTable: true,
  }))

  ngOnInit() {
    this.registerTableDevtools()
  }

  private registerTableDevtools() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
      injector: this.injector,
    }))
    injectTanStackTableDevtools(() => ({
      table: this.rowTable,
      injector: this.injector,
    }))
  }

  constructor() {
    effect(() => {
      const data = this.data()
      untracked(() => this.fullTableForm.reset({ data }))
    })
  }

  refreshData = () => {
    this.data.set(makeData(100))
  }

  stressTest = () => {
    this.data.set(makeData(1_000_000))
  }

  refreshRowData = () => {
    this.rowData.set(makeData(100))
  }

  addRow() {
    this.data.set([blankRow(), ...this.fullTableForm.state.values.data])
    this.table.firstPage()
  }

  saveRow = (originalRow: FormRow, value: FormRow) => {
    this.rowData.update((rows) =>
      rows.map((row) => (row === originalRow ? value : row)),
    )
  }

  submitFullTable(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.fullTableForm.handleSubmit()
  }

  fullFieldName(rowIndex: number, key: keyof FormRow): DeepKeys<FormData> {
    return `data[${rowIndex}].${key}`
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

  getSortTitle(column: {
    getCanSort: () => boolean
    getNextSortingOrder: () => false | 'asc' | 'desc'
  }) {
    if (!column.getCanSort()) return undefined

    const nextOrder = column.getNextSortingOrder()
    if (nextOrder === 'asc') return 'Sort ascending'
    if (nextOrder === 'desc') return 'Sort descending'

    return 'Clear sort'
  }
}
