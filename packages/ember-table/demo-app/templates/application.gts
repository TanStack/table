import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { pageTitle } from 'ember-page-title';
import { BasicAppTable } from '../examples/basic-table.gts';
import BasicExternalStateTable from '../examples/basic-external-state.gts';
import type { ComponentLike } from '@glint/template';

interface Example {
  id: string;
  label: string;
  component: ComponentLike;
}

const EXAMPLES: Array<Example> = [
  { id: 'basic', label: 'Basic', component: BasicAppTable },
  {
    id: 'basic-external-state',
    label: 'Basic (External State)',
    component: BasicExternalStateTable,
  },
];

const eq = (a: unknown, b: unknown): boolean => a === b;

const QUERY_PARAM = 'example';

function exampleIdFromUrl(): string {
  const id = new URLSearchParams(window.location.search).get(QUERY_PARAM);
  return EXAMPLES.some((example) => example.id === id) ? id! : EXAMPLES[0]!.id;
}

function writeExampleIdToUrl(id: string): void {
  const url = new URL(window.location.href);
  if (id === EXAMPLES[0]!.id) {
    url.searchParams.delete(QUERY_PARAM);
  } else {
    url.searchParams.set(QUERY_PARAM, id);
  }
  window.history.replaceState(null, '', url);
}

export default class Application extends Component {
  @tracked activeId: string = exampleIdFromUrl();

  get activeExample(): Example {
    return EXAMPLES.find((example) => example.id === this.activeId) ?? EXAMPLES[0]!;
  }

  selectExample = (example: Example) => () => {
    this.activeId = example.id;
    writeExampleIdToUrl(example.id);
  };

  <template>
    {{pageTitle "Ember Table Demo"}}

    <div class="example-tabs" role="tablist" aria-label="Examples">
      {{#each EXAMPLES as |example|}}
        <button
          type="button"
          role="tab"
          class="example-tab {{if (eq example.id this.activeId) 'is-active'}}"
          aria-selected="{{if (eq example.id this.activeId) 'true' 'false'}}"
          {{on "click" (this.selectExample example)}}
        >
          {{example.label}}
        </button>
      {{/each}}
    </div>

    <this.activeExample.component />
  </template>
}
