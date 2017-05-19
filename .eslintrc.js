module.exports = {
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      node: false
    },
    sourceType: 'module'
  },

  extends: ['standard'],

  plugins: ['react'],

  rules: {
    // Nozzle
    'jsx-quotes': [2, 'prefer-single'],
    'comma-dangle': [2, 'always-multiline'],

    // // React
    'react/jsx-boolean-value': 2,
    'react/jsx-curly-spacing': [2, 'never'],
    'react/jsx-equals-spacing': [2, 'never'],
    // 'react/jsx-indent': 2,
    'react/jsx-indent-props': [2, 2],
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-tag-spacing': [
      2,
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never'
      }
    ],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/self-closing-comp': 2,
    'react/jsx-no-bind': [
      2,
      {
        allowArrowFunctions: true,
        allowBind: false,
        ignoreRefs: true
      }
    ],
    'react/no-did-update-set-state': 2,
    'react/no-unknown-property': 2,
    'react/react-in-jsx-scope': 2,
    'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
    'react/jsx-tag-spacing': [2, { beforeSelfClosing: 'always' }],
    'react/jsx-wrap-multilines': 2,
    'react/self-closing-comp': 2,
    'react/jsx-key': 2,
    'react/jsx-no-comment-textnodes': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-target-blank': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/no-danger-with-children': 2,
    'react/no-deprecated': 2,
    'react/no-direct-mutation-state': 2,
    'react/no-find-dom-node': 2,
    'react/no-is-mounted': 2,
    'react/no-render-return-value': 2,
    'react/no-string-refs': 2,
    'react/no-unknown-property': 2,
    'react/react-in-jsx-scope': 2,
    'react/require-render-return': 2
    // 'react/jsx-max-props-per-line': [2, { maximum: 1 }]
  }
}
