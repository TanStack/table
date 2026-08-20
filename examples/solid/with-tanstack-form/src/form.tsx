import { createFormHook, createFormHookContexts } from '@tanstack/solid-form'
import { For, Show } from 'solid-js'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object' && 'message' in error) {
    const message = error.message
    if (typeof message === 'string') return message
  }

  return String(error)
}

function FieldErrors({
  errors,
  isBlurred,
  isTouched,
}: {
  errors: ReadonlyArray<unknown>
  isBlurred: boolean
  isTouched: boolean
}) {
  return (
    <Show when={(isTouched || isBlurred) && errors.length > 0}>
      <div class="error-text">{errors.map(getErrorMessage).join(', ')}</div>
    </Show>
  )
}

function TextField() {
  const field = useFieldContext<string>()

  return (
    <div>
      <input
        class="text-input"
        value={field().state.value}
        onInput={(e) => field().handleChange(e.currentTarget.value)}
        onBlur={() => field().handleBlur()}
      />
      <FieldErrors
        errors={field().state.meta.errors}
        isBlurred={field().state.meta.isBlurred}
        isTouched={field().state.meta.isTouched}
      />
    </div>
  )
}

function NumberField() {
  const field = useFieldContext<number>()

  return (
    <div>
      <input
        type="number"
        class="number-input"
        value={field().state.value}
        onInput={(e) => field().handleChange(Number(e.currentTarget.value))}
        onBlur={() => field().handleBlur()}
      />
      <FieldErrors
        errors={field().state.meta.errors}
        isBlurred={field().state.meta.isBlurred}
        isTouched={field().state.meta.isTouched}
      />
    </div>
  )
}

const statusOptions = ['relationship', 'complicated', 'single'] as const

function SelectField() {
  const field = useFieldContext<string>()

  return (
    <div>
      <select
        class="compact-input"
        value={field().state.value}
        onChange={(e) => field().handleChange(e.currentTarget.value)}
        onBlur={() => field().handleBlur()}
      >
        <For each={statusOptions}>
          {(status) => <option value={status}>{status}</option>}
        </For>
      </select>
      <FieldErrors
        errors={field().state.meta.errors}
        isBlurred={field().state.meta.isBlurred}
        isTouched={field().state.meta.isTouched}
      />
    </div>
  )
}

function SubmitButton(props: { label: string }) {
  const form = useFormContext()

  return (
    <button
      type="submit"
      disabled={!form.state.canSubmit || form.state.isSubmitting}
      class="demo-button primary-action submit-button"
    >
      {form.state.isSubmitting ? 'Submitting...' : props.label}
    </button>
  )
}

function FormStateIndicator() {
  const form = useFormContext()

  return (
    <div class="form-status">
      <span class={form.state.isDirty ? 'warning-text' : 'muted-text'}>
        {form.state.isDirty ? '● Modified' : '○ Pristine'}
      </span>
      <span class={form.state.isValid ? 'success-text' : 'error-text'}>
        {form.state.isValid ? '✓ Valid' : '✗ Invalid'}
      </span>
    </div>
  )
}

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
    FormStateIndicator,
  },
  fieldContext,
  formContext,
})
