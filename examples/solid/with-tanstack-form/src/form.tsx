import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from '@tanstack/solid-form'
import { For, Show } from 'solid-js'

// Create form and field contexts
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

// TextField component for string inputs
function TextField() {
  const field = useFieldContext<string>()
  const errors = useStore(field().store, (state) => state.meta.errors)

  return (
    <div>
      <input
        class="border rounded px-1 w-full"
        value={field().state.value}
        onInput={(e) => field().handleChange(e.currentTarget.value)}
        onBlur={() => field().handleBlur()}
      />
      <Show when={errors().length > 0}>
        <div class="text-red-500 text-xs">{errors().join(', ')}</div>
      </Show>
    </div>
  )
}

// NumberField component for numeric inputs
function NumberField() {
  const field = useFieldContext<number>()
  const errors = useStore(field().store, (state) => state.meta.errors)

  return (
    <div>
      <input
        type="number"
        class="border rounded px-1 w-20"
        value={field().state.value}
        onInput={(e) => field().handleChange(Number(e.currentTarget.value))}
        onBlur={() => field().handleBlur()}
      />
      <Show when={errors().length > 0}>
        <div class="text-red-500 text-xs">{errors().join(', ')}</div>
      </Show>
    </div>
  )
}

// SelectField component for status dropdown
const statusOptions = ['relationship', 'complicated', 'single'] as const

function SelectField() {
  const field = useFieldContext<string>()
  const errors = useStore(field().store, (state) => state.meta.errors)

  return (
    <div>
      <select
        class="border rounded px-1"
        value={field().state.value}
        onChange={(e) => field().handleChange(e.currentTarget.value)}
        onBlur={() => field().handleBlur()}
      >
        <For each={statusOptions}>
          {(status) => <option value={status}>{status}</option>}
        </For>
      </select>
      <Show when={errors().length > 0}>
        <div class="text-red-500 text-xs">{errors().join(', ')}</div>
      </Show>
    </div>
  )
}

// SubmitButton component that shows form state
function SubmitButton(props: { label: string }) {
  const form = useFormContext()
  return (
    <button
      type="submit"
      disabled={!form.state.canSubmit || form.state.isSubmitting}
      class="border rounded px-4 py-2 bg-blue-500 text-white disabled:opacity-50"
    >
      {form.state.isSubmitting ? 'Submitting...' : props.label}
    </button>
  )
}

// FormStateIndicator component to show dirty/valid state
function FormStateIndicator() {
  const form = useFormContext()
  return (
    <div class="flex gap-4 text-sm">
      <span class={form.state.isDirty ? 'text-yellow-600' : 'text-gray-400'}>
        {form.state.isDirty ? '● Modified' : '○ Pristine'}
      </span>
      <span class={form.state.isValid ? 'text-green-600' : 'text-red-600'}>
        {form.state.isValid ? '✓ Valid' : '✗ Invalid'}
      </span>
      <Show when={Object.keys(form.state.errorMap).length > 0}>
        <span class="text-red-600">
          Errors: {JSON.stringify(form.state.errorMap)}
        </span>
      </Show>
    </div>
  )
}

// Create the form hook with all components
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
