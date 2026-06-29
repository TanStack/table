import '@warp-drive/ember/install';
import Application from 'tanstack-ember-table-example-basic-external-state/app';
import config from 'tanstack-ember-table-example-basic-external-state/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

export function start() {
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart();
}
