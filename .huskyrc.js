module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && yarn test:ci',
    // 'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
}
