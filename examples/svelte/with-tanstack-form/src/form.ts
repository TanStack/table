import { createFormCreator } from '@tanstack/svelte-form'
import TextField from './TextField.svelte'
import NumberField from './NumberField.svelte'
import SelectField from './SelectField.svelte'
import SubmitButton from './SubmitButton.svelte'
import FormStateIndicator from './FormStateIndicator.svelte'

export const { createAppForm } = createFormCreator({
  fieldComponents: {
    TextField,
    NumberField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
    FormStateIndicator,
  },
})
