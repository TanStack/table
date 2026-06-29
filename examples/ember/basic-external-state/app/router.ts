import EmberRouter from '@embroider/router';
import config from 'tanstack-ember-table-example-basic-external-state/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Add route declarations here
});
