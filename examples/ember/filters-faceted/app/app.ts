/**
 * Looking for services that come from addons?
 *
 * See: https://github.com/embroider-build/embroider/issues/2659
 *
 * We currently don't support app-tree merging from libraries.
 *
 * For services, I highly recommend looking in to either of
 * - https://github.com/chancancode/ember-polaris-service-
 * - https://ember-primitives.pages.dev/6-utils/createService.md
 *   - https://ember-primitives.pages.dev/6-utils/createAsyncService.md
 */
import Application from "ember-strict-application-resolver";

export default class App extends Application {
  modules = {
    ...import.meta.glob("./router.*", { eager: true }),
    ...import.meta.glob("./templates/**/*", { eager: true }),
    ...import.meta.glob("./services/**/*", { eager: true }),
  };
}
