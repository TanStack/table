<!-- Advanced filter builder popover: per-column filters with operators,
  and/or join logic, and variant-specific value inputs. -->
<script lang="ts">
  import CalendarIcon from '@lucide/svelte/icons/calendar'
  import Check from '@lucide/svelte/icons/check'
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down'
  import ListFilter from '@lucide/svelte/icons/list-filter'
  import Trash2 from '@lucide/svelte/icons/trash-2'
  import {
    getLocalTimeZone,
    parseAbsoluteToLocal,
    toCalendarDate,
  } from '@internationalized/date'
  import type { CalendarDate, DateValue } from '@internationalized/date'
  import type {
    ExtendedColumnFilter,
    FilterOperator,
    JoinOperator,
  } from '@/types'
  import type { Column, RowData } from '@tanstack/svelte-table'
  import type { features } from '@/hooks/features'
  import { useTableContext } from '@/hooks/table.svelte'
  import { Badge } from '@/lib/components/ui/badge'
  import { Button } from '@/lib/components/ui/button'
  import { Input } from '@/lib/components/ui/input'
  import { Calendar } from '@/lib/components/ui/calendar'
  import { RangeCalendar } from '@/lib/components/ui/range-calendar'
  import * as Command from '@/lib/components/ui/command'
  import * as Popover from '@/lib/components/ui/popover'
  import * as Select from '@/lib/components/ui/select'
  import * as Faceted from '@/lib/components/ui/faceted'
  import { getFilterOperators } from '@/lib/data-table'
  import { cn, formatDate } from '@/lib/utils'

  type AppColumn = Column<typeof features, RowData>

  const table = useTableContext()
  const columnFilters = $derived(
    table.atoms.columnFilters.get() as Array<ExtendedColumnFilter>,
  )

  // Write through the raw controlled-state handler instead of
  // `table.setColumnFilters`: the table API auto-removes filters with empty
  // values, but a just-added filter row legitimately starts with `value: ''`
  // while the user is still building it.
  const setColumnFilters = (filters: Array<ExtendedColumnFilter>) => {
    table.options.onColumnFiltersChange?.(filters)
  }

  const uid = $props.id()
  const labelId = `${uid}-label`
  const descriptionId = `${uid}-description`
  const listId = `${uid}-list`
  let open = $state(false)

  const filterableColumns = $derived(
    table.getAllColumns().filter((column) => column.getCanFilter()),
  )

  function getColumnFilterVariant(column: AppColumn) {
    if (column.columnDef.meta?.variant) {
      return column.columnDef.meta.variant
    }

    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id)

    if (Array.isArray(firstValue)) return 'multi-select'
    if (typeof firstValue === 'number') return 'number'
    if (firstValue instanceof Date) return 'date'

    return 'text'
  }

  // Date filter values are stored as ISO strings; the calendar works in
  // @internationalized/date DateValue, so convert at this boundary.
  function isoToCalendarDate(iso: unknown): CalendarDate | undefined {
    if (typeof iso !== 'string' || !iso) return undefined
    try {
      return toCalendarDate(parseAbsoluteToLocal(iso))
    } catch {
      return undefined
    }
  }

  function dateValueToISO(value: DateValue | undefined): string | undefined {
    return value ? value.toDate(getLocalTimeZone()).toISOString() : undefined
  }

  function getColumnOptions(
    column: AppColumn,
  ): Array<{ label: string; value: string; count?: number }> {
    const customOptions = column.columnDef.meta?.options
    if (customOptions) return customOptions

    const uniqueValues = column.getFacetedUniqueValues()
    return Array.from(uniqueValues.entries()).map(([value, count]) => ({
      label: String(value),
      value: String(value),
      count,
    }))
  }

  function onFilterAdd() {
    const firstFilterableColumn = filterableColumns[0]
    if (!firstFilterableColumn) return

    const filterVariant = getColumnFilterVariant(firstFilterableColumn)
    const operators = getFilterOperators(filterVariant ?? 'text')

    setColumnFilters([
      ...columnFilters,
      {
        id: firstFilterableColumn.id,
        value: filterVariant === 'multi-select' ? [] : '',
        operator: operators[0].value,
        filterId: crypto.randomUUID(),
        joinOperator: 'and',
      },
    ])
  }

  function onFilterUpdate(
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter, 'filterId'>>,
  ) {
    const newFilters = columnFilters.map((filter) => {
      if (filter.filterId === filterId) {
        if (updates.id) {
          const newColumn = filterableColumns.find(
            (col) => col.id === updates.id,
          )
          if (newColumn) {
            const filterVariant = getColumnFilterVariant(newColumn)
            const operators = getFilterOperators(filterVariant ?? 'text')
            return {
              ...filter,
              ...updates,
              operator: operators[0].value,
              value: filterVariant === 'multi-select' ? [] : '',
            }
          }
        }

        if (updates.operator && filter.value) {
          const column = filterableColumns.find((col) => col.id === filter.id)
          if (column && getColumnFilterVariant(column) === 'date') {
            const currentValue = filter.value
            if (updates.operator === 'inRange' && !Array.isArray(currentValue)) {
              return {
                ...filter,
                ...updates,
                value: [currentValue, undefined],
              }
            } else if (
              updates.operator !== 'inRange' &&
              Array.isArray(currentValue)
            ) {
              return {
                ...filter,
                ...updates,
                value: currentValue[0] ?? '',
              }
            }
          }
        }

        return { ...filter, ...updates }
      }
      return filter
    })
    setColumnFilters(newFilters)
  }

  function onFilterRemove(filterId: string) {
    setColumnFilters(
      columnFilters.filter((filter) => filter.filterId !== filterId),
    )
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="[&_svg]:size-3">
        <ListFilter />
        Filter
        {#if columnFilters.length > 0}
          <Badge
            variant="secondary"
            class="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
          >
            {columnFilters.length}
          </Badge>
        {/if}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content
    aria-describedby={descriptionId}
    aria-labelledby={labelId}
    align="start"
    collisionPadding={16}
    class="flex flex-col gap-3 origin-(--transform-origin) p-4 w-[calc(100vw-theme(spacing.12))] min-w-60 sm:min-w-80 sm:w-fit"
  >
    <div class="flex flex-col gap-1">
      <h4 id={labelId} class="font-medium leading-none">Filters</h4>
      <p
        id={descriptionId}
        class={cn(
          'text-sm text-muted-foreground',
          columnFilters.length > 0 && 'sr-only',
        )}
      >
        {columnFilters.length > 0
          ? 'Modify filters to refine your results.'
          : 'Add filters to refine your results.'}
      </p>
    </div>
    {#if columnFilters.length > 0}
      <div
        role="list"
        id={listId}
        class="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-0.5"
      >
        {#each columnFilters as filter, index (filter.filterId)}
          {@render FilterRow({ filter, index })}
        {/each}
      </div>
    {/if}
    <div class="flex items-center gap-2">
      <Button size="sm" onclick={onFilterAdd} aria-label="Add new filter">
        Add filter
      </Button>
      {#if columnFilters.length > 0}
        <Button
          aria-label="Reset all filters"
          variant="outline"
          size="sm"
          onclick={() => setColumnFilters([])}
        >
          Reset filters
        </Button>
      {/if}
    </div>
  </Popover.Content>
</Popover.Root>

{#snippet FilterRow({
  filter,
  index,
}: {
  filter: ExtendedColumnFilter
  index: number
})}
  {@const column = table.getColumn(filter.id)}
  {#if column && filter.filterId}
    {@const filterVariant = getColumnFilterVariant(column) ?? 'text'}
    {@const operators = getFilterOperators(filterVariant)}
    {@const filterItemId = `${uid}-filter-${filter.filterId}`}
    {@const fieldListboxId = `${filterItemId}-field-listbox`}
    {@const operatorListboxId = `${filterItemId}-operator-listbox`}
    {@const inputId = `${filterItemId}-input`}
    {@const currentOperator = filter.operator ?? 'includesString'}

    <div
      role="listitem"
      id={filterItemId}
      class="grid items-center grid-cols-[70px_135px_125px_minmax(0,200px)_32px] gap-2"
    >
      {#if index === 0}
        <span class="text-sm text-center text-muted-foreground">Where</span>
      {:else if index === 1}
        <Select.Root
          type="single"
          value={filter.joinOperator}
          onValueChange={(value) => {
            if (columnFilters.length > 0) {
              setColumnFilters(
                columnFilters.map((f) => ({
                  ...f,
                  joinOperator: value as JoinOperator,
                })),
              )
            }
          }}
        >
          <Select.Trigger
            class="h-8"
            aria-label="Select join operator"
            aria-controls={fieldListboxId}
          >
            {filter.joinOperator ?? 'Join'}
          </Select.Trigger>
          <Select.Content id={`${filterItemId}-join-operator-listbox`}>
            <Select.Item value="and" label="and" />
            <Select.Item value="or" label="or" />
          </Select.Content>
        </Select.Root>
      {:else}
        <span class="text-sm text-center text-muted-foreground">
          {filter.joinOperator}
        </span>
      {/if}
      <Popover.Root>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              role="combobox"
              aria-controls={fieldListboxId}
              aria-label={`Select filter field. Current: ${column.columnDef.meta?.label ?? column.id}`}
              variant="outline"
              size="sm"
              class="h-8 justify-between font-normal focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <span class="truncate">
                {column.columnDef.meta?.label ?? column.id}
              </span>
              <ChevronsUpDown class="opacity-50" />
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content id={fieldListboxId} class="w-[135px] p-0">
          <Command.Root>
            <Command.Input
              placeholder="Search columns..."
              aria-label="Search filterable columns"
            />
            <Command.List>
              <Command.Empty>No column found.</Command.Empty>
              <Command.Group>
                {#each filterableColumns as col (col.id)}
                  <Command.Item
                    value={col.id}
                    onSelect={() => {
                      if (!filter.filterId) return
                      onFilterUpdate(filter.filterId, { id: col.id })
                    }}
                  >
                    <span class="truncate">
                      {col.columnDef.meta?.label ?? col.id}
                    </span>
                    <Check
                      class={cn(
                        'ml-auto size-4',
                        col.id === filter.id ? 'opacity-100' : 'opacity-0',
                      )}
                      aria-hidden="true"
                    />
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
      <Select.Root
        type="single"
        value={currentOperator}
        onValueChange={(value) => {
          if (!filter.filterId) return
          onFilterUpdate(filter.filterId, {
            operator: value as FilterOperator,
          })
        }}
      >
        <Select.Trigger
          class="h-8"
          aria-label="Select filter operator"
          aria-controls={operatorListboxId}
        >
          <span class="truncate">
            {operators.find((op) => op.value === currentOperator)?.label ??
              'Select operator'}
          </span>
        </Select.Trigger>
        <Select.Content id={operatorListboxId}>
          {#each operators as op (op.value)}
            <Select.Item value={op.value} label={op.label} />
          {/each}
        </Select.Content>
      </Select.Root>
      {@render FilterInput({
        column,
        operator: currentOperator,
        filterId: filter.filterId,
        inputId,
      })}
      <Button
        variant="outline"
        size="icon"
        class="size-8 [&_svg]:size-3.5"
        aria-label={`Remove ${column.columnDef.meta?.label ?? column.id} filter`}
        onclick={() => {
          if (!filter.filterId) return
          onFilterRemove(filter.filterId)
        }}
      >
        <Trash2 />
      </Button>
    </div>
  {/if}
{/snippet}

{#snippet FilterInput({
  column,
  operator,
  filterId,
  inputId,
}: {
  column: AppColumn
  operator: FilterOperator
  filterId: string
  inputId: string
})}
  {@const filterVariant = getColumnFilterVariant(column) ?? 'text'}
  {@const currentFilter = columnFilters.find((f) => f.filterId === filterId)}
  {@const columnLabel = column.columnDef.meta?.label ?? column.id}

  {#if filterVariant === 'date'}
    {#if operator === 'inRange'}
      {@const currentValue = Array.isArray(currentFilter?.value)
        ? currentFilter.value
        : [currentFilter?.value, undefined]}
      {@const rangeStart = isoToCalendarDate(currentValue[0])}
      {@const rangeEnd = isoToCalendarDate(currentValue[1])}

      <div class="flex items-center gap-2">
        <Popover.Root>
          <Popover.Trigger>
            {#snippet child({ props })}
              <Button
                {...props}
                id={inputId}
                aria-controls={`${inputId}-calendar`}
                aria-label={`${columnLabel} date range filter`}
                variant="outline"
                size="sm"
                class={cn(
                  'w-full justify-start text-left font-normal [&>svg]:size-3.5',
                  !rangeStart && !rangeEnd && 'text-muted-foreground',
                )}
              >
                <CalendarIcon />
                {#if currentValue[0]}
                  {#if currentValue[1]}
                    {formatDate(currentValue[0] as string, { month: 'short' })} -{' '}
                    {formatDate(currentValue[1] as string, { month: 'short' })}
                  {:else}
                    {formatDate(currentValue[0] as string, { month: 'short' })}
                  {/if}
                {:else}
                  <span>Select date range</span>
                {/if}
              </Button>
            {/snippet}
          </Popover.Trigger>
          <Popover.Content
            id={`${inputId}-calendar`}
            class="w-auto p-0"
            align="start"
          >
            <RangeCalendar
              aria-label={`Select ${columnLabel} date range`}
              value={{ start: rangeStart, end: rangeEnd }}
              placeholder={rangeStart}
              onValueChange={(range) => {
                onFilterUpdate(filterId, {
                  value: [
                    dateValueToISO(range.start),
                    dateValueToISO(range.end),
                  ],
                  operator,
                })
              }}
              numberOfMonths={2}
            />
          </Popover.Content>
        </Popover.Root>
      </div>
    {:else}
      {@const selectedDate = isoToCalendarDate(currentFilter?.value)}

      <Popover.Root>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              id={inputId}
              aria-controls={`${inputId}-calendar`}
              aria-label={`${columnLabel} date filter`}
              variant="outline"
              size="sm"
              class={cn(
                'w-full justify-start text-left font-normal [&>svg]:size-3.5',
                !currentFilter?.value && 'text-muted-foreground',
              )}
            >
              <CalendarIcon />
              {#if currentFilter?.value}
                {formatDate(currentFilter.value as string, { month: 'short' })}
              {:else}
                <span class="text-muted-foreground">Pick a date</span>
              {/if}
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content
          id={`${inputId}-calendar`}
          class="w-auto p-0"
          align="start"
        >
          <Calendar
            type="single"
            aria-label={`Select ${columnLabel} date`}
            value={selectedDate}
            placeholder={selectedDate}
            onValueChange={(date) => {
              onFilterUpdate(filterId, {
                value: dateValueToISO(date),
                operator,
              })
            }}
          />
        </Popover.Content>
      </Popover.Root>
    {/if}
  {:else if filterVariant === 'number'}
    {#if operator === 'inRange'}
      {@const currentValue = Array.isArray(currentFilter?.value)
        ? currentFilter.value
        : [currentFilter?.value, undefined]}

      <div class="flex items-center gap-2">
        <Input
          id={`${inputId}-min`}
          type="number"
          aria-label={`${columnLabel} minimum value`}
          value={(currentValue[0] as number | undefined) ?? ''}
          placeholder="Min"
          class="h-8"
          oninput={(event) => {
            onFilterUpdate(filterId, {
              value: [
                event.currentTarget.value === ''
                  ? undefined
                  : Number(event.currentTarget.value),
                currentValue[1] ?? undefined,
              ],
              operator,
            })
          }}
        />
        <Input
          id={`${inputId}-max`}
          type="number"
          aria-label={`${columnLabel} maximum value`}
          value={(currentValue[1] as number | undefined) ?? ''}
          placeholder="Max"
          class="h-8"
          oninput={(event) => {
            onFilterUpdate(filterId, {
              value: [
                currentValue[0] ?? undefined,
                event.currentTarget.value === ''
                  ? undefined
                  : Number(event.currentTarget.value),
              ],
              operator,
            })
          }}
        />
      </div>
    {:else}
      <Input
        id={inputId}
        type="number"
        aria-label={`${columnLabel} filter value`}
        value={(currentFilter?.value ?? '') as string}
        placeholder="Enter number..."
        class="h-8"
        oninput={(event) => {
          onFilterUpdate(filterId, {
            value:
              event.currentTarget.value === ''
                ? ''
                : Number(event.currentTarget.value),
            operator,
          })
        }}
      />
    {/if}
  {:else if filterVariant === 'select' || filterVariant === 'multi-select'}
    {@const options = getColumnOptions(column)}
    {@const multiple = filterVariant === 'multi-select'}
    {@const facetedValue = multiple
      ? Array.isArray(currentFilter?.value)
        ? (currentFilter.value as Array<string>)
        : []
      : typeof currentFilter?.value === 'string'
        ? currentFilter.value
        : undefined}

    <Faceted.Root
      {multiple}
      value={facetedValue}
      onValueChange={(value) => {
        onFilterUpdate(filterId, { value })
      }}
    >
      <Faceted.Trigger>
        {#snippet child({ props })}
          <Button
            {...props}
            id={inputId}
            aria-controls={`${inputId}-listbox`}
            aria-label={multiple
              ? `${columnLabel} filter values`
              : `${columnLabel} filter value`}
            variant="outline"
            size="sm"
            class="h-8 w-full justify-start text-left font-normal"
          >
            <Faceted.BadgeList
              {options}
              placeholder={`Select ${columnLabel}...`}
            />
          </Button>
        {/snippet}
      </Faceted.Trigger>
      <Faceted.Content id={`${inputId}-listbox`}>
        <Faceted.Input
          aria-label={`Search ${columnLabel} options`}
          placeholder={`Search ${columnLabel}...`}
        />
        <Faceted.List>
          <Faceted.Empty>No options found.</Faceted.Empty>
          <Faceted.Group>
            {#each options as option (option.value)}
              <Faceted.Item value={option.value}>
                <span>{option.label}</span>
                {#if option.count}
                  <span
                    class="ml-auto flex size-4 items-center justify-center font-mono text-xs"
                  >
                    {option.count}
                  </span>
                {/if}
              </Faceted.Item>
            {/each}
          </Faceted.Group>
        </Faceted.List>
      </Faceted.Content>
    </Faceted.Root>
  {:else if operator === 'isEmpty' || operator === 'isNotEmpty'}
    <div
      role="status"
      id={inputId}
      aria-live="polite"
      aria-label={`${columnLabel} filter is ${
        operator === 'isEmpty' ? 'empty' : 'not empty'
      }`}
      class="h-8 w-full rounded-md border border-dashed"
    ></div>
  {:else}
    <Input
      id={inputId}
      type="text"
      aria-label={`${columnLabel} filter value`}
      value={(currentFilter?.value ?? '') as string}
      placeholder={`Search ${columnLabel}...`}
      class="h-8"
      oninput={(event) => {
        onFilterUpdate(filterId, {
          value: event.currentTarget.value,
          operator,
        })
      }}
    />
  {/if}
{/snippet}
