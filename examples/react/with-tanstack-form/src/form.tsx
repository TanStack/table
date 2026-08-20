import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

// Create form and field contexts
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
  if (!isTouched && !isBlurred) return null
  if (errors.length === 0) return null

  return (
    <div className="error-text">{errors.map(getErrorMessage).join(', ')}</div>
  )
}

// TextField component for string inputs
function TextField() {
  const field = useFieldContext<string>()
  const { errors, isBlurred, isTouched } = field.state.meta

  return (
    <div>
      <input
        className="text-input"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldErrors
        errors={errors}
        isBlurred={isBlurred}
        isTouched={isTouched}
      />
    </div>
  )
}

// NumberField component for numeric inputs
function NumberField() {
  const field = useFieldContext<number>()
  const { errors, isBlurred, isTouched } = field.state.meta

  return (
    <div>
      <input
        type="number"
        className="number-input"
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        onBlur={field.handleBlur}
      />
      <FieldErrors
        errors={errors}
        isBlurred={isBlurred}
        isTouched={isTouched}
      />
    </div>
  )
}

// SelectField component for status dropdown
const statusOptions = ['relationship', 'complicated', 'single'] as const

function SelectField() {
  const field = useFieldContext<string>()
  const { errors, isBlurred, isTouched } = field.state.meta

  return (
    <div>
      <select
        className="compact-input"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <FieldErrors
        errors={errors}
        isBlurred={isBlurred}
        isTouched={isTouched}
      />
    </div>
  )
}

// SubmitButton component that shows form state
function SubmitButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="demo-button primary-action submit-button"
        >
          {isSubmitting ? 'Submitting...' : label}
        </button>
      )}
    </form.Subscribe>
  )
}

// FormStateIndicator component to show dirty/valid state
function FormStateIndicator() {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => ({
        isDirty: state.isDirty,
        isValid: state.isValid,
      })}
    >
      {({ isDirty, isValid }) => (
        <div className="form-status">
          <span className={isDirty ? 'warning-text' : 'muted-text'}>
            {isDirty ? '● Modified' : '○ Pristine'}
          </span>
          <span className={isValid ? 'success-text' : 'error-text'}>
            {isValid ? '✓ Valid' : '✗ Invalid'}
          </span>
        </div>
      )}
    </form.Subscribe>
  )
}

// Create the form hook with all components
export const { useAppForm, withForm } = createFormHook({
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
