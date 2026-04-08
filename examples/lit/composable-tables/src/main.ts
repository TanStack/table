import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import './components/users-table'
import './components/products-table'

@customElement('app-root')
class AppRoot extends LitElement {
  createRenderRoot() {
    return this
  }

  protected render() {
    return html`
      <div class="app">
        <h1>Composable Tables Example</h1>
        <p class="description">
          Both tables below use the same <code>useAppTable</code> hook and
          shareable components, but with different data types and column
          configurations.
        </p>

        <!-- Original Users Table -->
        <users-table></users-table>

        <div class="table-divider"></div>

        <!-- Products Table -->
        <products-table></products-table>
      </div>
    `
  }
}
