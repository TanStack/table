import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  columnResizingFeature,
  columnSizingFeature,
  constructTable,
  coreFeatures,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type {
  AggregationFns,
  ExtractAggregationFnKeys,
  ExtractFilterFnKeys,
  ExtractSortFnKeys,
  FilterFn,
  FilterFnOption,
  FilterFns,
  RowData,
  SortFn,
  SortFnOption,
  SortFns,
  TableFeatures,
  TableOptions,
  ValidateFeatureSlots,
} from '../../../../src'
import type { BuiltInAggregationFn } from '../../../../src/fns/aggregationFns'
import type { BuiltInFilterFn } from '../../../../src/fns/filterFns'
import type { BuiltInSortFn } from '../../../../src/fns/sortFns'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false
type Expect<T extends true> = T

interface Person {
  firstName: string
  age: number
}

// Custom fns annotated against the broad `TableFeatures` interface so they can
// be defined before (and registered inside) the features object.
const reverseAge: SortFn<TableFeatures, Person> = (rowA, rowB, columnId) =>
  rowB.getValue<number>(columnId) - rowA.getValue<number>(columnId)

const startsWithA: FilterFn<TableFeatures, RowData> = (row, columnId) =>
  String(row.getValue(columnId)).toLowerCase().startsWith('a')

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, startsWithA },
  sortFns: { ...sortFns, reverseAge },
})

const data: Array<Person> = [
  { firstName: 'amy', age: 20 },
  { firstName: 'bob', age: 40 },
  { firstName: 'alice', age: 30 },
]

function createTestTable(
  initialState?: TableOptions<typeof features, Person>['initialState'],
) {
  return constructTable({
    features: {
      ...coreFeatures,
      coreReactivityFeature: storeReactivityBindings(),
      ...features,
    },
    columns: [
      { accessorKey: 'firstName', id: 'firstName' },
      { accessorKey: 'age', id: 'age', sortFn: 'reverseAge' },
    ],
    data,
    initialState,
  })
}

describe('row model and fn registry feature slots', () => {
  it('strips row model factories and fn registries from registered features', () => {
    const table = createTestTable()

    expect(table._features).not.toHaveProperty('filteredRowModel')
    expect(table._features).not.toHaveProperty('sortedRowModel')
    expect(table._features).not.toHaveProperty('filterFns')
    expect(table._features).not.toHaveProperty('sortFns')
    expect(table._features).toHaveProperty('rowSortingFeature')
    expect(table._features).toHaveProperty('columnFilteringFeature')
  })

  it('registers fn registries on the table', () => {
    const table = createTestTable()

    expect(table._rowModelFns.sortFns?.reverseAge).toBe(reverseAge)
    expect(table._rowModelFns.sortFns?.alphanumeric).toBe(sortFns.alphanumeric)
    expect(table._rowModelFns.filterFns?.startsWithA).toBe(startsWithA)
    expect(table._rowModelFns.filterFns?.includesString).toBe(
      filterFns.includesString,
    )
  })

  it('sorts with a custom sort fn referenced by its registered name', () => {
    const table = createTestTable({ sorting: [{ id: 'age', desc: false }] })

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.age),
    ).toEqual([40, 30, 20])
  })

  it('filters with a custom filter fn registered in the slot', () => {
    const table = createTestTable({
      columnFilters: [{ id: 'firstName', value: 'anything' }],
    })

    // startsWithA ignores the filter value and keeps names starting with "a"
    table.setColumnFilters([{ id: 'firstName', value: 'x' }])
    const column = table.getColumn('firstName')!
    column.columnDef.filterFn = 'startsWithA'

    expect(
      table
        .getFilteredRowModel()
        .rows.map((row) => row.original.firstName)
        .sort(),
    ).toEqual(['alice', 'amy'])
  })

  it('infers fn name unions from the registries', () => {
    // registered keys (built-ins spread + custom) are the valid names
    type _sortKeys = Expect<
      Equal<ExtractSortFnKeys<typeof features>, BuiltInSortFn | 'reverseAge'>
    >
    type _filterKeys = Expect<
      Equal<
        ExtractFilterFnKeys<typeof features>,
        BuiltInFilterFn | 'startsWithA'
      >
    >

    // assignable in columnDef/option positions
    const customSortFn: SortFnOption<typeof features, Person> = 'reverseAge'
    const builtInSortFn: SortFnOption<typeof features, Person> = 'alphanumeric'
    const customFilterFn: FilterFnOption<typeof features, Person> =
      'startsWithA'
    const globalFilterFn: TableOptions<
      typeof features,
      Person
    >['globalFilterFn'] = 'startsWithA'

    // @ts-expect-error - not registered in the sortFns slot
    const unknownSortFn: SortFnOption<typeof features, Person> = 'nope'
    // @ts-expect-error - not registered in the filterFns slot
    const unknownFilterFn: FilterFnOption<typeof features, Person> = 'fuzzy'

    expect([
      customSortFn,
      builtInSortFn,
      customFilterFn,
      globalFilterFn,
      unknownSortFn,
      unknownFilterFn,
    ]).toBeDefined()
  })

  it('only allows fn names that exist at runtime when slots are present', () => {
    const slotlessFeatures = tableFeatures({ rowSortingFeature })

    // without a registry, built-in names are not registered and not assignable
    // @ts-expect-error - no sortFns registry was provided
    const builtIn: SortFnOption<typeof slotlessFeatures, Person> =
      'alphanumeric'

    // declaration-merged interfaces remain the fallback (empty by default)
    type _sortFallback = Expect<
      Equal<ExtractSortFnKeys<typeof slotlessFeatures>, keyof SortFns>
    >
    type _filterFallback = Expect<
      Equal<ExtractFilterFnKeys<typeof slotlessFeatures>, keyof FilterFns>
    >
    type _aggregationFallback = Expect<
      Equal<
        ExtractAggregationFnKeys<typeof slotlessFeatures>,
        keyof AggregationFns
      >
    >

    // internal `any` feature paths keep the broad unions
    type _anySortKeys = Expect<
      Equal<ExtractSortFnKeys<any>, keyof SortFns | BuiltInSortFn>
    >
    type _anyAggregationKeys = Expect<
      Equal<
        ExtractAggregationFnKeys<any>,
        keyof AggregationFns | BuiltInAggregationFn
      >
    >

    expect(builtIn).toBeDefined()
  })

  it('does not generate options for the non-feature slots', () => {
    type Options = TableOptions<typeof features, Person>

    // the rowModels table option is gone
    type _noRowModelsOption = Expect<
      Equal<Extract<keyof Options, 'rowModels'>, never>
    >
    // no debug keys for the slots
    type _noDebugKeys = Expect<
      Equal<
        Extract<
          keyof Options,
          | 'debugFilterFns'
          | 'debugSortFns'
          | 'debugFilteredRowModel'
          | 'debugSortedRowModel'
        >,
        never
      >
    >
    // feature-gated options are still inferred
    type _featureOptions = Expect<
      'onSortingChange' extends keyof Options ? true : false
    >

    expect(true).toBe(true)
  })

  it('errors when a slot is missing its prerequisite feature', () => {
    const missingSorting = tableFeatures({
      rowPaginationFeature,
      paginatedRowModel: createPaginatedRowModel(),
      // @ts-expect-error - sortedRowModel requires rowSortingFeature
      sortedRowModel: createSortedRowModel(),
      // @ts-expect-error - sortFns requires rowSortingFeature
      sortFns,
    })

    const missingFiltering = tableFeatures({
      rowSortingFeature,
      // @ts-expect-error - filteredRowModel requires a filtering feature
      filteredRowModel: createFilteredRowModel(),
    })

    // globalFilteringFeature and the filtering slots all require columnFilteringFeature
    const globalOnly = tableFeatures({
      // @ts-expect-error - globalFilteringFeature requires columnFilteringFeature
      globalFilteringFeature,
      // @ts-expect-error - filteredRowModel requires columnFilteringFeature
      filteredRowModel: createFilteredRowModel(),
      // @ts-expect-error - filterFns requires columnFilteringFeature
      filterFns,
    })

    // columnFilteringFeature satisfies the prerequisite for all filtering slots
    const withColumnFiltering = tableFeatures({
      columnFilteringFeature,
      globalFilteringFeature,
      filteredRowModel: createFilteredRowModel(),
      filterFns,
    })

    // columnResizingFeature requires columnSizingFeature
    const missingSizing = tableFeatures({
      // @ts-expect-error - columnResizingFeature requires columnSizingFeature
      columnResizingFeature,
    })

    const withSizing = tableFeatures({
      columnSizingFeature,
      columnResizingFeature,
    })

    expect(missingSorting).toBeDefined()
    expect(missingFiltering).toBeDefined()
    expect(globalOnly).toBeDefined()
    expect(withColumnFiltering).toBeDefined()
    expect(missingSizing).toBeDefined()
    expect(withSizing).toBeDefined()
  })

  it('validates slots on the features table option too', () => {
    type _featuresOption = TableOptions<
      { rowSortingFeature: typeof rowSortingFeature },
      Person
    >['features']

    // the misplaced slot's type collapses to the error message string
    type _misplacedSlot = ValidateFeatureSlots<{
      sortedRowModel: NonNullable<TableFeatures['sortedRowModel']>
    }>['sortedRowModel']
    type _isErrorMessage = Expect<
      _misplacedSlot extends `Error: 'sortedRowModel' requires '${string}'${string}`
        ? true
        : false
    >

    // a satisfied slot keeps its original type
    type _validSlot = ValidateFeatureSlots<{
      rowSortingFeature: typeof rowSortingFeature
      sortFns: typeof sortFns
    }>['sortFns']
    type _keepsType = Expect<Equal<_validSlot, typeof sortFns>>

    expect(true).toBe(true)
  })
})
