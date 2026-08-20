import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UsersTable } from './components/users-table/users-table'
import { ProductsTable } from './components/products-table/products-table'

@Component({
  selector: 'app-root',
  imports: [UsersTable, ProductsTable],
  host: {
    class: 'app',
  },
  template: `
    <h1>Composable Tables Example</h1>
    <p class="description">
      Both tables below use the same <code>injectAppTable</code> function and
      shareable components, but with different data types and column
      configurations.
    </p>

    <users-table />

    <div class="table-divider"></div>

    <products-table />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
