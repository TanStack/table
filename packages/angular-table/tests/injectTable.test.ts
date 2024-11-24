import { describe, expect, test } from 'vitest'
import { Component, input, isSignal, signal, untracked } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { ColumnDef, stockFeatures } from '@tanstack/table-core'
import { injectTable } from '../src/injectTable'
import {
  experimentalReactivity_testShouldBeComputedProperty,
  setSignalInputs,
  testShouldBeComputedProperty,
} from './test-utils'

describe('injectTable', () => {
  test('should render with required signal inputs', () => {
    @Component({
      selector: 'app-fake',
      template: ``,
      standalone: true,
    })
    class FakeComponent {
      data = input.required<Array<any>>()

      table = injectTable(() => ({
        data: this.data(),
        _features: stockFeatures,
        columns: [],
      }))
    }

    const fixture = TestBed.createComponent(FakeComponent)
    setSignalInputs(fixture.componentInstance, {
      data: [],
    })

    fixture.detectChanges()
  })

  describe('Proxy table', () => {
    type Data = { id: string; title: string }
    const data = signal<Array<Data>>([{ id: '1', title: 'Title' }])
    const columns: Array<ColumnDef<any, Data>> = [
      { id: 'id', header: 'Id', cell: (context) => context.getValue() },
      { id: 'title', header: 'Title', cell: (context) => context.getValue() },
    ]
    const table = injectTable(() => ({
      data: data(),
      _features: stockFeatures,
      columns: columns,
      getRowId: (row) => row.id,
    }))
    const tablePropertyKeys = Object.keys(table())

    test('table must be a signal', () => {
      expect(isSignal(table)).toEqual(true)
    })

    test('supports "in" operator', () => {
      expect('_features' in table).toBe(true)
      expect('options' in table).toBe(true)
      expect('notFound' in table).toBe(false)
    })

    test('supports "Object.keys"', () => {
      const keys = Object.keys(table())
      expect(Object.keys(table)).toEqual(keys)
    })

    test.each(
      tablePropertyKeys.map((property) => [
        property,
        testShouldBeComputedProperty(untracked(table), property),
      ]),
    )('property (%s) is computed -> (%s)', (name, expected) => {
      const tableProperty = table[name as keyof typeof table]
      expect(isSignal(tableProperty)).toEqual(expected)
    })
  })
})
