import { module, test } from 'qunit';
import { render, pauseTest } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit'
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { useTable } from '#src/index.ts';
import {
  stockFeatures,
} from '@tanstack/table-core'

module('Integration | useTable', function(hooks) {
  setupRenderingTest(hooks);

  test('can initialize with basic no columns or data', async (assert) => {
    class TableComponent extends Component {
      @tracked data = [];

      table = useTable(() => ({
        data: this.data,
        features: stockFeatures,
        columns: [],
      }));

      <template>
        {{!-- @glint-expect-error Incorrect type for column because no columns are defined --}}
        {{#each this.table.columns as |column index|}}
          <p data-test-column={{index}}>{{column}}</p>
        {{/each}}

        <p data-test-render-complete>Render Complete</p>
      </template>
    }

    await render(<template>
      <TableComponent />
    </template>)

    assert.dom('[data-test-render-complete]').exists('Rendering should complete without error');
    assert.dom('[data-test-column]').doesNotExist(
      'No stale or unregistered columns are rendered'
    );
  })
});
