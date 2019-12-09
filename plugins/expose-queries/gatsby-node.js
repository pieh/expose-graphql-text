const path = require(`path`)
const { kebabCase } = require(`lodash`)

// copied from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/utils/js-chunk-names.js
const generateComponentChunkName = (componentPath, store) => {
  const program = store.getState().program
  let directory = `/`
  if (program && program.directory) {
    directory = program.directory
  }
  const name = path.relative(directory, componentPath)
  return `component---${kebabCase(name)}`
}

exports.onCreateWebpackConfig = ({ actions, plugins, store }) => {
  const { components } = store.getState()

  // massage our internal state a bit to better fit usecase
  // also components is a Map not an object
  const queries = {}
  components.forEach(({ query, componentPath }) => {
    queries[generateComponentChunkName(componentPath, store)] = query
  })

  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        QUERIES: JSON.stringify(queries),
      }),
    ],
  })
}

// need to expose componentPath for SSR as we don't get that right now
exports.onCreatePage = ({ page, actions, store }) => {
  if (!page.context.componentChunkName) {
    actions.createPage({
      ...page,
      context: {
        ...page.context,
        componentChunkNameCustom: generateComponentChunkName(
          page.componentPath,
          store
        ),
      },
    })
  }
}
