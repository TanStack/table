import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from '@tanstack/react-form'

// Create form and field contexts
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

// TextField component for string inputs
function TextField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <input
        className="text-input"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {errors.length > 0 && (
        <div className="error-text">{errors.join(', ')}</div>
      )}
    </div>
  )
}

// NumberField component for numeric inputs
function NumberField() {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <input
        type="number"
        className="number-input"
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        onBlur={field.handleBlur}
      />
      {errors.length > 0 && (
        <div className="error-text">{errors.join(', ')}</div>
      )}
    </div>
  )
}

// SelectField component for status dropdown
const statusOptions = ['relationship', 'complicated', 'single'] as const

function SelectField() {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

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
      {errors.length > 0 && (
        <div className="error-text">{errors.join(', ')}</div>
      )}
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
        errorMap: state.errorMap,
      })}
    >
      {({ isDirty, isValid, errorMap }) => (
        <div className="form-status">
          <span className={isDirty ? 'warning-text' : 'muted-text'}>
            {isDirty ? '● Modified' : '○ Pristine'}
          </span>
          <span className={isValid ? 'success-text' : 'error-text'}>
            {isValid ? '✓ Valid' : '✗ Invalid'}
          </span>
          {Object.keys(errorMap).length > 0 && (
            <span className="error-text">
              Errors: {JSON.stringify(errorMap)}
            </span>
          )}
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
