import { describe, expect, it } from 'vitest'
import {
  rowAggregationFeature,
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  columnResizingFeature,
  columnSizingFeature,
  constructTable,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type {
  AggregationFnOption,
  AggregationFns,
  AggregationResult,
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
import type { BuiltInAggregationFn } from '../../../../src/features/row-aggregation/aggregationFns'
import type { BuiltInFilterFn } from '../../../../src/features/column-filtering/filterFns'
import type { BuiltInSortFn } from '../../../../src/features/row-sorting/sortFns'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false
type Expect<T extends true> = T

interface Person {
  firstName: string
  age: number
}

interface SortRecord {
  name: string
  priority?: number
  score: number
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
    features: testFeatures(features),
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

  it('preserves multi-sort metadata resolution order', () => {
    const table = constructTable({
      features: testFeatures(features),
      columns: [
        { accessorKey: 'name', id: 'name' },
        {
          accessorKey: 'priority',
          id: 'priority',
          sortUndefined: 'last',
        },
        {
          accessorKey: 'score',
          id: 'score',
          invertSorting: true,
        },
      ],
      data: [
        { name: 'a', priority: 1, score: 10 },
        { name: 'b', score: 5 },
        { name: 'c', priority: 1, score: 20 },
        { name: 'd', score: 10 },
        { name: 'e', priority: 2, score: 30 },
      ] satisfies Array<SortRecord>,
      initialState: {
        sorting: [
          { id: 'priority', desc: false },
          { id: 'score', desc: false },
        ],
      },
    })

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.name),
    ).toEqual(['c', 'a', 'e', 'd', 'b'])
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
    true satisfies Expect<
      Equal<ExtractSortFnKeys<typeof features>, BuiltInSortFn | 'reverseAge'>
    >
    true satisfies Expect<
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
    true satisfies Expect<
      Equal<ExtractSortFnKeys<typeof slotlessFeatures>, keyof SortFns>
    >
    true satisfies Expect<
      Equal<ExtractFilterFnKeys<typeof slotlessFeatures>, keyof FilterFns>
    >
    true satisfies Expect<
      Equal<
        ExtractAggregationFnKeys<typeof slotlessFeatures>,
        keyof AggregationFns
      >
    >

    // internal `any` feature paths keep the broad unions
    true satisfies Expect<
      Equal<ExtractSortFnKeys<any>, keyof SortFns | BuiltInSortFn>
    >
    true satisfies Expect<
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
    true satisfies Expect<Equal<Extract<keyof Options, 'rowModels'>, never>>
    // no debug keys for the slots
    true satisfies Expect<
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
    true satisfies Expect<
      'onSortingChange' extends keyof Options ? true : false
    >

    expect(true).toBe(true)
  })

  it('errors when a slot is missing its prerequisite feature', () => {
    const missingAggregation = tableFeatures({
      // @ts-expect-error - aggregationFns requires rowAggregationFeature
      aggregationFns,
    })

    const withAggregation = tableFeatures({
      rowAggregationFeature,
      aggregationFns,
    })

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

    expect(missingAggregation).toBeDefined()
    expect(withAggregation).toBeDefined()
    expect(missingSorting).toBeDefined()
    expect(missingFiltering).toBeDefined()
    expect(globalOnly).toBeDefined()
    expect(withColumnFiltering).toBeDefined()
    expect(missingSizing).toBeDefined()
    expect(withSizing).toBeDefined()
  })

  it('types scalar, multi, and feature-aware aggregation APIs', () => {
    const aggregateFeatures = tableFeatures({
      rowAggregationFeature,
      aggregationFns,
    })
    const option: AggregationFnOption<typeof aggregateFeatures, Person> = [
      'count',
      { id: 'average', aggregationFn: 'mean' },
    ]
    true satisfies Expect<
      Equal<
        AggregationResult<readonly ['count', 'mean'], typeof aggregateFeatures>,
        { count: number; mean: number | undefined }
      >
    >

    const table = constructTable({
      features: testFeatures(aggregateFeatures),
      data,
      columns: [{ accessorKey: 'age', aggregationFn: option }],
    })
    const column = table.getColumn('age')!
    column.getAggregationFns()
    column.getAggregationValue({ rows: table.getCoreRowModel().rows })
    if (false) {
      // @ts-expect-error - grouping APIs are absent without columnGroupingFeature
      column.getCanGroup()
      // @ts-expect-error - row-selection row models require rowSelectionFeature
      table.getFilteredSelectedRowModel()
      // @ts-expect-error - aggregation options use known properties
      column.getAggregationValue({ scope: 'core' })
      // @ts-expect-error - rows are provided through the options object
      column.getAggregationValue(table.getCoreRowModel().rows)
    }

    const selectedFeatures = tableFeatures({
      rowAggregationFeature,
      aggregationFns,
      rowSelectionFeature,
    })
    const selectedTable = constructTable({
      features: testFeatures(selectedFeatures),
      data,
      columns: [{ accessorKey: 'age', aggregationFn: 'sum' }],
    })
    selectedTable.getColumn('age')!.getAggregationValue({
      rows: selectedTable.getFilteredSelectedRowModel().rows,
    })

    const groupingFeatures = tableFeatures({
      columnGroupingFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const groupingTable = constructTable({
      features: testFeatures(groupingFeatures),
      data,
      columns: [{ accessorKey: 'firstName' }],
    })
    const groupingColumn = groupingTable.getColumn('firstName')!
    groupingColumn.getCanGroup()
    if (false) {
      // @ts-expect-error - aggregation APIs are absent without rowAggregationFeature
      groupingColumn.getAggregationValue()
    }

    expect(option).toBeDefined()
  })

  it('validates slots on the features table option too', () => {
    // the features table option type resolves without collapsing to never
    true satisfies [
      TableOptions<
        { rowSortingFeature: typeof rowSortingFeature },
        Person
      >['features'],
    ] extends [never]
      ? false
      : true

    // the misplaced slot's type collapses to the error message string
    type _misplacedSlot = ValidateFeatureSlots<{
      sortedRowModel: NonNullable<TableFeatures['sortedRowModel']>
    }>['sortedRowModel']
    true satisfies Expect<
      _misplacedSlot extends `Error: 'sortedRowModel' requires '${string}'${string}`
        ? true
        : false
    >

    // a satisfied slot keeps its original type
    type _validSlot = ValidateFeatureSlots<{
      rowSortingFeature: typeof rowSortingFeature
      sortFns: typeof sortFns
    }>['sortFns']
    true satisfies Expect<Equal<_validSlot, typeof sortFns>>

    expect(true).toBe(true)
  })
})
