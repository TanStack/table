import EmbroiderRouter from "@embroider/router";
import config from "#config";

export default class Router extends EmbroiderRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});

/**
 * Caveat:
 * - https://github.com/embroider-build/embroider/issues/2521
 *   We don't yet have a way to do this in a nice way
 *
 */
// function bundle(name: string, loader: () => Promise<{ default: unknown }>[]) {
//   return {
//     names: [name],
//     load: async () => {
//       const [template, route, controller] = await Promise.all(loader());
//       let slashName = name.replaceAll(".", "/");
//       let results: Record<string, unknown> = {};

//       if (template) results[`./templates/${slashName}`] = template.default;
//       if (route) results[`./routes/${slashName}`] = route.default;
//       if (controller) results[`./controllers/${slashName}`] = controller.default;

//       return {
//         default: results,
//       };
//     },
//   };
// }

/**
 * Examples from:
 * - https://github.com/NullVoxPopuli/limber/blob/67e2f54bbe224052e38f9a9e566d704411e65e86/apps/repl/app/router.ts#L35
 */
// (window as any)._embroiderRouteBundles_ = [
// bundle("docs", () => [import("./templates/docs.gts")]),
// bundle("docs.repl-sdk", () => [import("./templates/docs/repl-sdk.gts")]),
// bundle("docs.ember-repl", () => [import("./templates/docs/ember-repl.gts")]),
// bundle("docs.embedding", () => [import("./templates/docs/embedding.gts")]),
// bundle("docs.editor", () => [import("./templates/docs/editor.gts")]),
// bundle("docs.whatever", () => [
//   import("./the/template.gts"),
//   import("./the/route.ts"),
//   import("./the/controller.ts"),
// ]),
// ];
