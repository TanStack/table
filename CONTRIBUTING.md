---
title: Contributing
id: contributing
---

# Contributing

## Questions

If you have questions about implementation details, help or support, then please use our dedicated community forum at [Github Discussions](https://github.com/tanstack/table/discussions) **PLEASE NOTE:** If you choose to instead open an issue for your question, your issue will be immediately closed and redirected to the forum.

## Reporting Issues

If you have found what you think is a bug, first search the [open and closed issues](https://github.com/TanStack/table/issues?q=is%3Aissue) to make sure it has not already been reported. If you cannot find an existing report, use the [bug report template](https://github.com/TanStack/table/issues/new?template=bug_report.yml). **PLEASE NOTE:** Issues that are identified as implementation questions or non-issues will be immediately closed and redirected to [Github Discussions](https://github.com/tanstack/table/discussions).

## Suggesting new features

If you are here to suggest a feature, first create an issue if it does not already exist. From there, we will discuss use-cases for the feature and then finally discuss how it could be implemented.

## Development

Before proceeding with development, ensure you match one of the following criteria:

- Fixing a small bug
- Fixing a larger issue that has been previously discussed and agreed-upon by maintainers
- Adding a new feature that has been previously discussed and agreed-upon by maintainers

## Pull Request Guidelines

Every pull request must follow the [TanStack Table pull request template](.github/pull_request_template.md). Complete its description and checklist without removing or bypassing the required sections.

- Search the [open and closed pull requests](https://github.com/TanStack/table/pulls?q=is%3Apr) before starting work to avoid duplicating an existing contribution.
- Keep each pull request focused on one change or topic. Pull requests that combine unrelated changes will be closed with a request to split them into separately reviewable contributions.
- Write a concise description that clearly explains what changed and why. Follow the sections in the pull request template; a long, unstructured description makes a contribution harder to review.
- You may use AI tools to help generate code, but you remain responsible for understanding, testing, and verifying every submitted change. Do not submit unreviewed, low-quality, or irrelevant generated code.
- Do not mass-submit unrelated or low-quality AI-generated pull requests. We treat that behavior as spam and may close the pull requests, block the contributor, and report the GitHub account.

## Development Workflow

- Fork the repository and create a branch for your contribution. We prefer the `feat-*` branch name style.
- Ensure you have `pnpm` installed, then install dependencies from the repository root with `pnpm i`. Do not install dependencies separately inside an example.
- Build the affected packages with `pnpm build`. Use `pnpm build:all` when you need to build every package.
- Implement your change, including relevant tests and documentation.
- To run an example, change into its directory and run `pnpm dev` or `pnpm start`. Examples run on [http://localhost:7777](http://localhost:7777) by default.
- Before opening a pull request with code changes, run both `pnpm test` and `pnpm test:e2e` from the repository root. On the first end-to-end test run, you may need to install the browser with `pnpm test:e2e:install`. Documentation, configuration, and other non-code changes do not require these test suites.
- Every change that affects a published package must include a changeset. Create the changelog entry with `pnpm changeset`; documentation, CI, and development-only changes do not require one.
- Commit your work, open a pull request, complete the required template, and submit it for review.
