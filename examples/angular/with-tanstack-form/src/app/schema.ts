import { z } from 'zod'
import type { Person } from './makeData'

export type FormRow = Omit<Person, 'subRows'>

export const personSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z
    .number()
    .min(0, 'Age must be positive')
    .max(150, 'Age must be realistic'),
  visits: z.number().min(0, 'Visits must be positive'),
  progress: z
    .number()
    .min(0, 'Progress must be 0-100')
    .max(100, 'Progress must be 0-100'),
  status: z.enum(['relationship', 'complicated', 'single']),
})

export const formSchema = z.object({
  data: z.array(personSchema),
})

export type FormData = z.infer<typeof formSchema>

export const blankRow = (): FormRow => ({
  firstName: '',
  lastName: '',
  age: 0,
  visits: 0,
  progress: 0,
  status: 'single',
})
