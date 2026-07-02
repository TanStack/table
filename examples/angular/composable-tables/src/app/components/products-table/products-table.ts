import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  inject,
  signal,
} from '@angular/core'
import { NgComponentOutlet } from '@angular/common'
import {
  FlexRender,
  TanStackTable,
  TanStackTableCell,
  TanStackTableHeader,
  flexRenderComponent,
} from '@tanstack/angular-table'
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'
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
  private readonly injector = inject(Injector)

  readonly data = signal(makeProductData(1_000))

  readonly columns = productColumnHelper.columns([
    productColumnHelper.display({
      id: 'select',
      header: ({ header }) => flexRenderComponent(header.SelectHeader),
      cell: ({ cell }) => flexRenderComponent(cell.SelectCell),
    }),
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
    key: 'products-table', // needed for devtools
    columns: this.columns,
    data: this.data(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
    // more table options
  }))

  ngOnInit() {
    this.registerTableDevtools()
  }

  private registerTableDevtools() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
      injector: this.injector,
    }))
  }

  onRefresh = () => {
    this.data.set([...makeProductData(1_000)])
  }

  refreshData = () => this.data.set(makeProductData(1_000))
  stressTest = () => this.data.set(makeProductData(200_000))
}
