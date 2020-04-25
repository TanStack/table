import React from 'react'

import { useGetLatest, useMountedLayoutEffect } from '../utils'

export default function useStateSync(instance) {
  const getInstance = useGetLatest(instance)

  const columnFilterResetDeps = [
    instance.options.manualColumnFilters ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetColumnFilters) {
      instance.state.columnFilters = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, columnFilterResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetColumnFilters) {
      instance.resetColumnFilters()
    }
  }, columnFilterResetDeps)

  const globalFilterResetDeps = [
    instance.options.manualGlobalFilter ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetGlobalFilter) {
      instance.state.globalFilterValue = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, globalFilterResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetGlobalFilter) {
      instance.resetGlobalFilter()
    }
  }, globalFilterResetDeps)

  const groupingResetDeps = [
    instance.options.manualGrouping ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetGrouping) {
      instance.state.grouping = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, groupingResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetGrouping) {
      instance.resetGrouping()
    }
  }, groupingResetDeps)

  const expandedResetDeps = [instance.options.data]

  React.useMemo(() => {
    if (getInstance().options.autoResetExpanded) {
      instance.state.expanded = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, expandedResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetExpanded) {
      instance.resetExpanded()
    }
  }, expandedResetDeps)

  const sortingResetDeps = [
    instance.options.manualSorting ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetSorting) {
      instance.state.sorting = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, sortingResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetSorting) {
      instance.resetSorting()
    }
  }, sortingResetDeps)

  const selectionResetDeps = [instance.options.data]
  React.useMemo(() => {
    if (getInstance().options.autoResetSelection) {
      instance.state.selection = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, selectionResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetSelection) {
      instance.resetSelection()
    }
  }, selectionResetDeps)
}
