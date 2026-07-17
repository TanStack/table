import { constructFilterFn } from '@tanstack/solid-table'
import { dataReferenceDate } from './makeData'
import type { Account } from './makeData'

export type FacetKey = string

export type Bucket<TValue> = {
  value: FacetKey
  label: string
  test: (value: TValue) => boolean
}

export type FacetOption = Pick<Bucket<unknown>, 'value' | 'label'>

export interface BucketColumnMeta {
  filterVariant?: 'text' | 'facets'
  facetOptions?: ReadonlyArray<FacetOption>
}

const now = dataReferenceDate
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const startOfYesterday = new Date(startOfToday)
startOfYesterday.setDate(startOfYesterday.getDate() - 1)
const startOfWeek = new Date(startOfToday)
startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7))
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

export const lastLoginBuckets = [
  {
    value: 'today',
    label: 'Today',
    test: (value: Date) => value >= startOfToday,
  },
  {
    value: 'yesterday',
    label: 'Yesterday',
    test: (value: Date) => value >= startOfYesterday,
  },
  {
    value: 'this-week',
    label: 'This week',
    test: (value: Date) => value >= startOfWeek,
  },
  {
    value: 'this-month',
    label: 'This month',
    test: (value: Date) => value >= startOfMonth,
  },
  { value: 'older', label: 'Older', test: () => true },
] satisfies ReadonlyArray<Bucket<Date>>

export const GB = 1024 ** 3
export const storageBuckets = [
  { value: 'under-1-gb', label: '< 1 GB', test: (value: number) => value < GB },
  {
    value: '1-to-10-gb',
    label: '1–10 GB',
    test: (value: number) => value < 10 * GB,
  },
  {
    value: '10-to-100-gb',
    label: '10–100 GB',
    test: (value: number) => value < 100 * GB,
  },
  { value: '100-gb-plus', label: '100+ GB', test: () => true },
] satisfies ReadonlyArray<Bucket<number>>

export function getBucket<TValue>(
  value: TValue,
  buckets: ReadonlyArray<Bucket<TValue>>,
): FacetKey {
  const bucket = buckets.find((candidate) => candidate.test(value))
  if (!bucket) throw new Error(`No facet bucket matched ${String(value)}`)
  return bucket.value
}

export function createBucketFilter<TValue>(
  buckets: ReadonlyArray<Bucket<TValue>>,
) {
  return constructFilterFn({
    resolveDataValue: (value) => getBucket(value as TValue, buckets),
    filter: (bucketValue, selectedBuckets: ReadonlyArray<FacetKey>) =>
      selectedBuckets.includes(bucketValue),
    autoRemove: (selectedBuckets: ReadonlyArray<FacetKey>) =>
      !selectedBuckets.length,
  })
}

export function formatBytes(value: number) {
  if (value < GB) return `${(value / 1024 ** 2).toFixed(0)} MB`
  return `${(value / GB).toFixed(1)} GB`
}

export type { Account }
