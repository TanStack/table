module.exports = {
  hooks: {
    'pre-commit': 'lint-staged',
    'prepare-commit-msg': 'exec < /dev/tty && git cz --hook',
  },
}
