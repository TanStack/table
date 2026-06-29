import { constructTable, coreFeatures } from '../../src'
import { generateTestColumnDefs } from '../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../fixtures/data/generateTestData'
import { storeReactivityBindings } from '../../src/store-reactivity-bindings'
import type {
  Row,
  TableFeatures,
  TableOptions,
  TableState,
  Table_Internal,
} from '../../src'
import type { Person } from '../fixtures/data/types'

export function generateTestTableWithData<TFeatures extends TableFeatures>(
  lengths: Array<number> | number = 10,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | 'features'
  > & {
    features?: TFeatures
  },
): Table_Internal<TFeatures, Person> {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = generateTestData(...lengthsArray)
  const columns = generateTestColumnDefs<TFeatures>(data)

  return constructTable<TFeatures, Person>({
    data,
    columns,
    getSubRows: (row: Row<TFeatures, Person>) => row.subRows,
    ...options,
    features: {
      ...coreFeatures,
      ...options?.features,
      coreReactivityFeature: storeReactivityBindings(),
    },
  } as any) as unknown as Table_Internal<TFeatures, Person>
}

export function generateTestTableFromData<TFeatures extends TableFeatures>(
  data: Array<Person>,
  options?: Omit<TableOptions<TFeatures, Person>, 'data' | 'columns'>,
): Table_Internal<TFeatures, Person> {
  const columns = generateTestColumnDefs<TFeatures>(data)
  return constructTable<TFeatures, Person>({
    data,
    columns,
    ...options,
    features: {
      ...coreFeatures,
      ...options?.features,
      coreReactivityFeature: storeReactivityBindings(),
    },
  } as any) as unknown as Table_Internal<TFeatures, Person>
}

export function generateTestTableWithDataAndState<
  TFeatures extends TableFeatures,
>(
  lengths: Array<number> | number = 10,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | 'onStateChange'
  >,
): Table_Internal<TFeatures, Person> {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = generateTestData(...lengthsArray)
  const columns = generateTestColumnDefs<TFeatures>(data)
  let state = { ...options?.initialState } as TableState<TFeatures>

  const table = generateTestTableWithData<TFeatures>(lengths, {
    data,
    columns,
    ...options,
    features: {
      ...options?.features,
    },
    state,
    onStateChange: (updater: any) => {
      if (typeof updater === 'function') {
        state = updater(state)
      } else {
        state = updater
      }

      ;(table.options as any).state = state
    },
  } as any)

  return table
}

export function generateTestTableWithStateFromData<
  TFeatures extends TableFeatures,
>(
  data: Array<Person>,
  options?: Omit<
    TableOptions<TFeatures, Person>,
    'data' | 'columns' | 'onStateChange'
  >,
): Table_Internal<TFeatures, Person> {
  const columns = generateTestColumnDefs<TFeatures>(data)
  let state = { ...options?.initialState } as TableState<TFeatures>

  const table = generateTestTableFromData<TFeatures>(data, {
    columns,
    ...options,
    features: {
      ...options?.features,
    },
    state,
    onStateChange: (updater: any) => {
      if (typeof updater === 'function') {
        state = updater(state)
      } else {
        state = updater
      }
    },
  } as any)

  return table
}
