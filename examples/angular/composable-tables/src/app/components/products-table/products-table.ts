import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { NgComponentOutlet } from '@angular/common'
import {
  FlexRender,
  TanStackTable,
  TanStackTableCell,
  TanStackTableHeader,
} from '@tanstack/angular-table'
import { makeProductData } from '../../makeData'
import { createAppColumnHelper, injectAppTable } from '../../table'
import type { Product } from '../../makeData'

export const productColumnHelper = createAppColumnHelper<Product>()

@Component({
  selector: 'products-table',
  templateUrl: './products-table.html',
  imports: [
    NgComponentOutlet,
    FlexRender,
    TanStackTable,
    TanStackTableHeader,
    TanStackTableCell,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTable {
  readonly data = signal(makeProductData(1_000))

  readonly columns = productColumnHelper.columns([
    productColumnHelper.accessor('name', {
      header: 'Product Name',
      footer: (props) => props.column.id,
      cell: ({ cell }) => cell.TextCell,
    }),
    productColumnHelper.accessor('category', {
      header: 'Category',
      footer: (props) => props.column.id,
      cell: ({ cell }) => cell.CategoryCell,
    }),
    productColumnHelper.accessor('price', {
      header: 'Price',
      footer: (props) => props.column.id,
      cell: ({ cell }) => cell.PriceCell,
    }),
    productColumnHelper.accessor('stock', {
      header: 'In Stock',
      footer: (props) => props.column.id,
      cell: ({ cell }) => cell.NumberCell,
    }),
    productColumnHelper.accessor('rating', {
      header: 'Rating',
      footer: (props) => props.column.id,
      cell: ({ cell }) => cell.ProgressCell,
    }),
  ])

  table = injectAppTable(() => ({
    columns: this.columns,
    data: this.data(),
    getRowId: (row) => row.id,
    // more table options
  }))

  onRefresh = () => {
    this.data.set([...makeProductData(1_000)])
  }

  refreshData = () => this.data.set(makeProductData(1_000))
  stressTest = () => this.data.set(makeProductData(100_000))
}
