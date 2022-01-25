// Originally ported to TS from https://github.com/remix-run/react-router/tree/main/scripts/{version,publish}.js
const path = require("path");
const { exec, execSync } = require("child_process");
const fsp = require("fs/promises");
const chalk = require("chalk");
const jsonfile = require("jsonfile");
const semver = require("semver");
const currentGitBranch = require("current-git-branch");
const parseCommit = require("@commitlint/parse").default;
const log = require("git-log-parser");
const streamToArray = require("stream-to-array");
const axios = require("axios");
const { DateTime } = require("luxon");

type Commit = {
  commit: CommitOrTree;
  tree: CommitOrTree;
  author: AuthorOrCommitter;
  committer: AuthorOrCommitter;
  subject: string;
  body: string;
  parsed: Parsed;
};

type CommitOrTree = {
  long: string;
  short: string;
};

type AuthorOrCommitter = {
  name: string;
  email: string;
  date: string;
};

type Parsed = {
  type: string;
  scope?: string | null;
  subject: string;
  merge?: null;
  header: string;
  body?: null;
  footer?: null;
  notes?: null[] | null;
  references?: null[] | null;
  mentions?: null[] | null;
  revert?: null;
  raw: string;
};

type Package = { name: string; srcDir: string; deps?: string[] };

// TODO: List your npm packages here. The first package will be used as the versioner.
const packages: Package[] = [
  { name: "@tanstack/react-table", srcDir: "packages/react-table/src" },
  {
    name: "@tanstack/react-table-devtools",
    srcDir: "packages/react-table-devtools/src",
    deps: ["@tanstack/react-table"],
  },
];

const branches: Record<string, { prerelease: boolean; tag: string }> = {
  main: {
    tag: "latest",
    prerelease: false,
  },
  next: {
    tag: "next",
    prerelease: true,
  },
  beta: {
    tag: "beta",
    prerelease: true,
  },
  alpha: {
    tag: "alpha",
    prerelease: true,
  },
};

const releaseCommitMsg = (version: string) => `release: v${version}`;

const filterCommitsFn = (commit: Commit) => {
  const exclude = [
    commit.subject.startsWith("Merge branch "), // No merge commits
    commit.subject.startsWith(releaseCommitMsg("")), // No example update commits
  ].some(Boolean);

  return !exclude;
};

const rootDir = path.resolve(__dirname, "..");
const examplesDir = path.resolve(rootDir, "examples");

async function run() {
  const branchName: string = currentGitBranch();
  const branch = branches[branchName];
  const prereleaseBranch = branch.prerelease ? branchName : undefined;

  let remoteURL = execSync("git config --get remote.origin.url").toString();

  remoteURL = remoteURL.substring(0, remoteURL.indexOf(".git"));

  // Get tags
  let tags: string[] = execSync("git tag").toString().split("\n");

  // Filter tags to our branch/pre-release combo
  tags = tags
    .filter(semver.valid)
    .filter((tag) => {
      if (branch.prerelease) {
        return tag.includes(`-${branchName}`);
      }
      return semver.prerelease(tag) == null;
    })
    // sort by latest
    .sort(semver.compare);

  // Get the latest tag
  let latestTag = [...tags].pop();

  let range = `${latestTag}..HEAD`;
  // let range = ``;

  if (!latestTag) {
    if (process.env.FIRST_TAG === "true") {
      console.log(
        chalk.yellow(
          "No tags found. This is the first tag for this branch. Publishing..."
        )
      );
      latestTag = "v0.0.0";
      range = "";
    } else {
      throw new Error(
        "Could not find latest tag! To make a release tag of v0.0.1, run with FIRST_TAG=true"
      );
    }
  }

  // Get the commits since the latest tag
  let commitsSinceLatestTag = (
    await new Promise<Commit[]>((resolve, reject) => {
      const strm = log.parse({
        _: range,
      });

      streamToArray(strm, function (err: any, arr: any[]) {
        if (err) return reject(err);

        Promise.all(
          arr.map(async (d) => {
            const parsed = await parseCommit(d.subject);

            return { ...d, parsed };
          })
        ).then((res) => resolve(res.filter(Boolean)));
      });
    })
  ).filter(filterCommitsFn);

  console.log(
    `Parsing ${commitsSinceLatestTag.length} commits since ${latestTag}...`
  );

  // If RELEASE_ALL is set via a commit subject or body, all packages will be
  // released regardless if they have changed files matching the package srcDir.
  let RELEASE_ALL = false;

  // Pares the commit messsages, log them, and determine the type of release needed
  const recommendedReleaseLevel: number = commitsSinceLatestTag.reduce(
    (releaseLevel, commit) => {
      if (["fix", "refactor"].includes(commit.parsed.type)) {
        releaseLevel = Math.max(releaseLevel, 0);
      }
      if (["feat"].includes(commit.parsed.type)) {
        releaseLevel = Math.max(releaseLevel, 1);
      }
      if (commit.body.includes("BREAKING CHANGE")) {
        releaseLevel = Math.max(releaseLevel, 2);
      }
      if (
        commit.subject.includes("RELEASE_ALL") ||
        commit.body.includes("RELEASE_ALL")
      ) {
        RELEASE_ALL = true;
      }

      return releaseLevel;
    },
    -1
  );

  const changedFiles: string[] = execSync(`git diff ${latestTag} --name-only`)
    .toString()
    .split("\n")
    .filter(Boolean);

  const changedPackages = RELEASE_ALL
    ? packages
    : changedFiles.reduce((changedPackages, file) => {
        const pkg = packages.find((p) => file.startsWith(p.srcDir));
        if (pkg && !changedPackages.find((d) => d.name === pkg.name)) {
          changedPackages.push(pkg);
        }
        return changedPackages;
      }, [] as Package[]);

  if (recommendedReleaseLevel === 2) {
    console.log(
      `Major versions releases must be tagged and released manually.`
    );
    return;
  }

  if (recommendedReleaseLevel === -1) {
    console.log(
      `There have been no changes since the release of ${latestTag} that require a new version. You're good!`
    );
    return;
  }

  function getSorterFn<TItem>(sorters: ((d: TItem) => any)[]) {
    return (a: TItem, b: TItem) => {
      let i = 0;

      sorters.some((sorter) => {
        const sortedA = sorter(a);
        const sortedB = sorter(b);
        if (sortedA > sortedB) {
          i = 1;
          return true;
        }
        if (sortedA < sortedB) {
          i = -1;
          return true;
        }
        return false;
      });

      return i;
    };
  }

  const changelogCommitsMd = await Promise.all(
    Object.entries(
      commitsSinceLatestTag.reduce((acc, next) => {
        const type = next.parsed.type?.toLowerCase() ?? "other";

        return {
          ...acc,
          [type]: [...(acc[type] || []), next],
        };
      }, {} as Record<string, Commit[]>)
    )
      .sort(
        getSorterFn([
          ([d]) =>
            [
              "other",
              "examples",
              "docs",
              "chore",
              "refactor",
              "fix",
              "feat",
            ].indexOf(d),
        ])
      )
      .reverse()
      .map(async ([type, commits]) => {
        return Promise.all(
          commits.map(async (commit) => {
            let username = "";

            if (process.env.GH_TOKEN) {
              const query = `${commit.author.email ?? commit.committer.email}`;

              const res = await axios.get(
                "https://api.github.com/search/users",
                {
                  params: {
                    q: query,
                  },
                  headers: {
                    Authorization: `token ${process.env.GH_TOKEN}`,
                  },
                }
              );

              username = res.data.items[0]?.login;
            }

            const scope = commit.parsed.scope
              ? `(${commit.parsed.scope}): `
              : "";
            const subject = commit.parsed.subject ?? commit.subject;
            // const commitUrl = `${remoteURL}/commit/${commit.commit.long}`;

            return `- ${scope}${subject} (${commit.commit.short}) ${
              username
                ? `by @${username}`
                : `by ${commit.author.name ?? commit.author.email}`
            }`;
          })
        ).then((commits) => [type, commits] as const);
      })
  ).then((groups) => {
    return groups
      .map(([type, commits]) => {
        return [`### ${capitalize(type)}`, commits.join("\n")].join("\n\n");
      })
      .join("\n\n");
  });

  const version = getNextVersion(
    latestTag,
    recommendedReleaseLevel,
    prereleaseBranch
  );

  const changelogMd = [
    `Version ${version} - ${DateTime.now().toLocaleString(
      DateTime.DATETIME_SHORT
    )}`,
    `## Changes`,
    changelogCommitsMd,
    `## Packages`,
    changedPackages.map((d) => `- ${d.name}@${version}`).join("\n"),
  ].join("\n\n");

  console.log("Generating changelog...");
  console.log();
  console.log(changelogMd);
  console.log();

  console.log("Building packages...");
  execSync(`yarn build`, { encoding: "utf8" });

  console.log("Linking packages...");
  execSync(`yarn linkAll`, { encoding: "utf8" });

  console.log("Testing packages...");
  execSync(`yarn test:ci`, { encoding: "utf8" });
  console.log("");

  console.log(
    `Updating all changed packages and their dependencies to version ${version}...`
  );
  // Update each package to the new version along with any dependencies
  for (const pkg of changedPackages) {
    console.log(`  Updating ${pkg.name} version to ${version}...`);

    await updatePackageConfig(pkg.name, (config) => {
      config.version = version;
      pkg.deps?.forEach((dependency) => {
        if (config.dependencies[dependency]) {
          console.log(
            `    Updating dependency on ${pkg.name} to version ${version}.`
          );
          config.dependencies[dependency] = version;
        }
      });
    });
  }

  console.log(`Updating examples dependencies...`);
  let examples = await fsp.readdir(examplesDir);
  for (const example of examples) {
    let stat = await fsp.stat(path.join(examplesDir, example));
    if (!stat.isDirectory()) continue;

    console.log(`  Updating example ${example} to version ${version}...`);

    await updateExamplesPackageConfig(example, (config) => {
      changedPackages.forEach((pkg) => {
        if (config.dependencies[pkg.name]) {
          console.log(
            `    Updating dependency ${pkg.name} to version ${version}...`
          );
          config.dependencies[pkg.name] = version;
        }
      });
    });
  }

  if (!process.env.CI) {
    console.warn(
      `This is a dry run for version ${version}. Push to CI to publish for real or set CI=true to override!`
    );
    return;
  }

  // Tag and commit
  console.log(`Creating new git tag v${version}`);
  execSync(`git tag -a -m "v${version}" v${version}`);

  let taggedVersion = getTaggedVersion();
  if (!taggedVersion) {
    throw new Error(
      "Missing the tagged release version. Something weird is afoot!"
    );
  }

  console.log();
  console.log(`Verifying packages are on version ${version}`);

  // Ensure packages are up to date and ready
  await Promise.all(
    changedPackages.map(async (pkg) => {
      let file = path.join(
        rootDir,
        "packages",
        getPackageDir(pkg.name),
        "package.json"
      );
      let json = await jsonfile.readFile(file);

      if (json.version !== version) {
        throw new Error(
          `Package ${pkg.name} is on version ${json.version}, but should be on ${version}`
        );
      }

      for (const dependency of pkg.deps ?? []) {
        if (json.dependencies[dependency] !== version) {
          throw new Error(
            `Package ${pkg.name}'s dependency of ${dependency} is on version ${json.dependencies[dependency]}, but should be on ${version}`
          );
        }
      }
    })
  );

  console.log();
  console.log(`Publishing all packages to npm with tag "${branch.tag}"`);

  // Publish each package
  changedPackages.map((pkg) => {
    let packageDir = path.join(rootDir, "packages", getPackageDir(pkg.name));
    const cmd = `cd ${packageDir} && yarn publish --tag ${branch.tag} --access=public`;
    console.log(
      `  Publishing ${pkg.name}@${version} to npm with tag "${branch.tag}"...`
    );
    execSync(`${cmd} --token ${process.env.NPM_TOKEN}`, { stdio: "inherit" });
  });

  console.log(`Pushing new tags to branch.`);
  execSync(`git push --tags`);
  console.log(`Pushed tags to branch.`);

  // Stringify the markdown to excape any quotes
  execSync(
    `gh release create v${version} ${
      branch.prerelease ? "--prerelease" : ""
    } --notes '${changelogMd}'`
  );

  console.log(`Committing changes...`);
  execSync(`git add -A && git commit -m "${releaseCommitMsg(version)}"`);
  console.log();
  console.log(`Committed Changes.`);
  console.log(`Pushing changes...`);
  execSync(`git push`);
  console.log();
  console.log(`Changes pushed.`);
  console.log(`Pushing tags...`);
  execSync(`git push --tags`);
  console.log();
  console.log(`Tags pushed.`);
  console.log(`All done!`);
}

run().catch((err) => {
  console.log(err);
  process.exit(1);
});

function capitalize(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function getPackageDir(packageName: string) {
  return packageName
    .split("/")
    .filter((d) => !d.startsWith("@"))
    .join("/");
}

function getNextVersion(
  currentVersion: string,
  recommendedReleaseLevel: number,
  prereleaseBranch?: string
) {
  const releaseType = prereleaseBranch
    ? "prerelease"
    : { 0: "patch", 1: "minor", 2: "major" }[recommendedReleaseLevel];

  if (!releaseType) {
    throw new Error(
      `Invalid release brand: ${prereleaseBranch} or level: ${recommendedReleaseLevel}`
    );
  }

  let nextVersion = semver.inc(currentVersion, releaseType, prereleaseBranch);

  if (!nextVersion) {
    throw new Error(
      `Invalid version increment: ${JSON.stringify({
        currentVersion,
        recommendedReleaseLevel,
        prereleaseBranch,
      })}`
    );
  }

  return nextVersion;
}

async function getPackageVersion(packageName: string) {
  let file = packageJson(packageName);
  let json = await jsonfile.readFile(file);
  return json.version;
}

async function updatePackageConfig(
  packageName: string,
  transform: (json: any) => void
) {
  let file = packageJson(packageName);
  let json = await jsonfile.readFile(file);
  transform(json);
  await jsonfile.writeFile(file, json, { spaces: 2 });
}

async function updateExamplesPackageConfig(
  example: string,
  transform: (json: any) => void
) {
  let file = packageJson(example, "examples");
  let json = await jsonfile.readFile(file);
  transform(json);
  await jsonfile.writeFile(file, json, { spaces: 2 });
}

function packageJson(packageName: string, directory = "packages") {
  return path.join(
    rootDir,
    directory,
    getPackageDir(packageName),
    "package.json"
  );
}

function getTaggedVersion() {
  let output = execSync("git tag --list --points-at HEAD").toString();
  return output.replace(/^v|\n+$/g, "");
}
