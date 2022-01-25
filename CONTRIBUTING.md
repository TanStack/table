---
name: Contributing
route: /contributing
---

# Contributing

## Questions

If you have questions about implementation details, help or support, then please use our dedicated community forum at [Github Discussions](https://github.com/tanstack/react-table/discussions) **PLEASE NOTE:** If you choose to instead open an issue for your question, your issue will be immediately closed and redirected to the forum.

## Reporting Issues

If you have found what you think is a bug, please [file an issue](https://github.com/tanstack/react-table/issues/new). **PLEASE NOTE:** Issues that are identified as implementation questions or non-issues will be immediately closed and redirected to [Github Discussions](https://github.com/tanstack/react-table/discussions)

## Suggesting new features

If you are here to suggest a feature, first create an issue if it does not already exist. From there, we will discuss use-cases for the feature and then finally discuss how it could be implemented.

## Development

Before proceeding with development, ensure you match one of the following criteria:

- Fixing a small bug
- Fixing a larger issue that has been previously discussed and agreed-upon by maintainers
- Adding a new feature that has been previously discussed and agreed-upon by maintainers

## Development Workflow

- Fork this repository, we prefer the `feat-*` branch name style
- Ensure you have `yarn` installed
- Install projects dependencies by running `yarn`
- Link projects locally by running `yarn linkAll`
- Auto-build and auto-test files as you edit by running `yarn dev`
- Implement your changes and tests
- To run examples, follow their individual directions. Usually this includes:
  - Installing dependencies with `yarn`
  - Linking any dependencies to your local versions, eg. `yarn link @tanstack/react-table`
  - Starting the dev server with `yarn start`
- Document your changes in the appropriate documentation website markdown pages
- Commit your work and open a pull request
- Submit PR for review
