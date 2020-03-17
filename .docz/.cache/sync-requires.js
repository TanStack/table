const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---contributing-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/CONTRIBUTING.md"))),
  "component---changelog-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/CHANGELOG.md"))),
  "component---code-of-conduct-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/CODE_OF_CONDUCT.md"))),
  "component---readme-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/README.md"))),
  "component---typescript-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/TYPESCRIPT.md"))),
  "component---docs-faq-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/faq.md"))),
  "component---docs-installation-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/installation.md"))),
  "component---docs-examples-mdx": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/examples.mdx"))),
  "component---docs-concepts-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/concepts.md"))),
  "component---docs-quickstart-mdx": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/quickstart.mdx"))),
  "component---docs-api-readme-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/README.md"))),
  "component---docs-api-use-absolute-layout-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useAbsoluteLayout.md"))),
  "component---docs-api-use-block-layout-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useBlockLayout.md"))),
  "component---docs-api-use-column-order-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useColumnOrder.md"))),
  "component---docs-api-use-filters-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useFilters.md"))),
  "component---docs-api-use-flex-layout-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useFlexLayout.md"))),
  "component---docs-api-use-global-filter-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useGlobalFilter.md"))),
  "component---docs-api-use-expanded-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useExpanded.md"))),
  "component---docs-api-use-group-by-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useGroupBy.md"))),
  "component---docs-api-use-pagination-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/usePagination.md"))),
  "component---docs-api-use-row-select-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useRowSelect.md"))),
  "component---docs-api-use-row-state-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useRowState.md"))),
  "component---docs-api-use-sort-by-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useSortBy.md"))),
  "component---docs-api-use-table-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useTable.md"))),
  "component---docs-api-use-resize-columns-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useResizeColumns.md"))),
  "component---docs-api-use-token-pagination-md": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/api/useTokenPagination.md"))),
  "component---docs-examples-complex-mdx": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/examples/complex.mdx"))),
  "component---docs-examples-controlled-mdx": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/examples/controlled.mdx"))),
  "component---docs-examples-simple-mdx": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/examples/simple.mdx"))),
  "component---docs-examples-ui-mdx": hot(preferDefault(require("/Users/jasonclark/Source/react-table/docs/examples/ui.mdx"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/jasonclark/Source/react-table/.docz/src/pages/404.js")))
}

