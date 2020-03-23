const get = require('lodash/get')

const NO_OP = () => {}

const DEFAULT_RESOLVABLE_EXTENSIONS = () => [`.js`, `.jsx`]

let gatsbyNodeCustom = {}
try {
  gatsbyNodeCustom = require('./gatsby-node.custom')
} catch (err) {}

// https://www.gatsbyjs.org/docs/node-apis/

exports.createPages = args => {
  const createPages = get(gatsbyNodeCustom, 'createPages', NO_OP)
  return createPages(args)
}

exports.createPagesStatefully = args => {
  const createPagesStatefully = get(
    gatsbyNodeCustom,
    'createPagesStatefully',
    NO_OP,
  )
  return createPagesStatefully(args)
}

exports.createResolvers = args => {
  const createResolvers = get(gatsbyNodeCustom, 'createResolvers', NO_OP)
  return createResolvers(args)
}

exports.createSchemaCustomization = args => {
  const createSchemaCustomization = get(
    gatsbyNodeCustom,
    'createSchemaCustomization',
    NO_OP,
  )
  return createSchemaCustomization(args)
}

exports.generateSideEffects = args => {
  const generateSideEffects = get(
    gatsbyNodeCustom,
    'generateSideEffects',
    NO_OP,
  )
  return generateSideEffects(args)
}

exports.onCreateBabelConfig = args => {
  const onCreateBabelConfig = get(
    gatsbyNodeCustom,
    'onCreateBabelConfig',
    NO_OP,
  )
  return onCreateBabelConfig(args)
}

exports.onCreateDevServer = args => {
  const onCreateDevServer = get(gatsbyNodeCustom, 'onCreateDevServer', NO_OP)
  return onCreateDevServer(args)
}

exports.onCreateNode = args => {
  const onCreateNode = get(gatsbyNodeCustom, 'onCreateNode', NO_OP)
  return onCreateNode(args)
}

exports.onCreatePage = args => {
  const onCreatePage = get(gatsbyNodeCustom, 'onCreatePage', NO_OP)
  return onCreatePage(args)
}

exports.onCreateWebpackConfig = args => {
  const onCreateWebpackConfig = get(
    gatsbyNodeCustom,
    'onCreateWebpackConfig',
    NO_OP,
  )
  return onCreateWebpackConfig(args)
}

exports.onPostBootstrap = args => {
  const onPostBootstrap = get(gatsbyNodeCustom, 'onPostBootstrap', NO_OP)
  return onPostBootstrap(args)
}

exports.onPostBuild = args => {
  const onPostBuild = get(gatsbyNodeCustom, 'onPostBuild', NO_OP)
  return onPostBuild(args)
}

exports.onPreBootstrap = args => {
  const onPreBootstrap = get(gatsbyNodeCustom, 'onPreBootstrap', NO_OP)
  return onPreBootstrap(args)
}

exports.onPreBuild = args => {
  const onPreBuild = get(gatsbyNodeCustom, 'onPreBuild', NO_OP)
  return onPreBuild(args)
}

exports.onPreExtractQueries = args => {
  const onPreExtractQueries = get(
    gatsbyNodeCustom,
    'onPreExtractQueries',
    NO_OP,
  )
  return onPreExtractQueries(args)
}

exports.onPreInit = args => {
  const onPreInit = get(gatsbyNodeCustom, 'onPreInit', NO_OP)
  return onPreInit(args)
}

exports.preprocessSource = args => {
  const preprocessSource = get(gatsbyNodeCustom, 'preprocessSource', NO_OP)
  return preprocessSource(args)
}

exports.resolvableExtensions = args => {
  const resolvableExtensions = get(
    gatsbyNodeCustom,
    'resolvableExtensions',
    DEFAULT_RESOLVABLE_EXTENSIONS,
  )
  return resolvableExtensions(args)
}

exports.setFieldsOnGraphQLNodeType = args => {
  const setFieldsOnGraphQLNodeType = get(
    gatsbyNodeCustom,
    'setFieldsOnGraphQLNodeType',
    () => ({}),
  )
  return setFieldsOnGraphQLNodeType(args)
}

exports.sourceNodes = args => {
  const sourceNodes = get(gatsbyNodeCustom, 'sourceNodes', NO_OP)
  return sourceNodes(args)
}
