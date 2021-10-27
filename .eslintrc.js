/**
 * 官方配置网址：https://eslint.org/docs/user-guide/configuring
 * eslint
 * eslint-config-standard：代码审查规则
 * eslint-plugin-standard
 * eslint-plugin-promise
 * eslint-plugin-import
 * eslint-plugin-node
 * eslint-plugin-vue
 * babel-eslint
 * eslint-loader
 * eslint-friendly-formatter
 * */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential', // eslint-plugin-vue
    '@vue/standard' // @vue/eslint-config-standard
  ],
  plugins: ['import'],
  rules: {
    camelcase: 0,
    'comma-dangle': [2, 'only-multiline'],
    indent: 0,
    'no-extend-native': 2,
    'no-multiple-empty-lines': 0,
    'no-return-assign': 0,
    'object-curly-spacing': 0,
    'space-before-function-paren': [0, 'always'],
    'vue/no-use-v-if-with-v-for': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    // parser: 'babel-eslint'
  }
}
