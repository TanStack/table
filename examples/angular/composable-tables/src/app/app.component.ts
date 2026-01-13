import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UsersTable } from './components/users-table/users-table'
import { ProductsTable } from './components/products-table/products-table'

@Component({
  selector: 'app-root',
  imports: [UsersTable, ProductsTable],
  host: {
    class: 'app',
  },
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
