const { resolve } = require(`path`)
const path = require(`path`)
const glob = require(`glob`)
const chunk = require(`lodash/chunk`)
const { dd } = require(`dumper.js`)
const helpers = require(`gatsby-source-wordpress-experimental/steps/source-nodes/helpers`)

const getTemplates = () => {
  const sitePath = path.resolve(`./`)
  return glob.sync(`./src/templates/**/*.js`, { cwd: sitePath })
}

//
// @todo move this to gatsby-theme-wordpress
exports.createPages = async ({ actions, graphql, reporter }) => {
  const templates = getTemplates()

  const {
    data: {
      wp: { generalSettings },
      allWpContentNode: { nodes: contentNodes },
    },
  } = await graphql(/* GraphQL */ `
    query ALL_CONTENT_NODES {
      wp {
        generalSettings {
          title
          url
        }
      }
      allWpContentNode(
        sort: { fields: modifiedGmt, order: DESC }
        filter: { nodeType: { ne: "MediaItem" } }
      ) {
        nodes {
          nodeType
          uri
          id
        }
      }
    }
  `)

  const contentTypeTemplateDirectory = `./src/templates/single/`
  const contentTypeTemplates = templates.filter((path) =>
    path.includes(contentTypeTemplateDirectory)
  )

  await Promise.all(
    contentNodes.map(async (node, i) => {
      const { nodeType, uri, id } = node
      // this is a super super basic template hierarchy
      // this doesn't reflect what our hierarchy will look like.
      // this is for testing/demo purposes
      const templatePath = `${contentTypeTemplateDirectory}${nodeType}.js`

      const contentTypeTemplate = contentTypeTemplates.find(
        (path) => path === templatePath
      )

      if (!contentTypeTemplate) {
        dd(node)
        reporter.log(``)
        reporter.log(``)
        reporter.panic(
          `[using-gatsby-source-wordpress] No template found at ${templatePath}\nfor single ${nodeType} ${
            node.id
          } with path ${
            node.uri
          }\n\nAvailable templates:\n${contentTypeTemplates.join(`\n`)}`
        )
      }

      await actions.createPage({
        component: resolve(contentTypeTemplate),
        path: uri,
        context: {
          id,
          nextPage: (contentNodes[i + 1] || {}).id,
          previousPage: (contentNodes[i - 1] || {}).id,
        },
      })

      const { nodeQuery: query } =
        helpers.getQueryInfoBySingleFieldName(nodeType.toLowerCase()) || {}

      const { data: previewData } = await graphql(`
      query {
        wp${nodeType} {
          id
          databaseId
        }
      }
    `)

      actions.createPage({
        component: resolve(contentTypeTemplate),
        path: `/preview/types/${nodeType.toLowerCase()}`,
        context: {
          wpUrl: generalSettings.url,
          preview: true,
          id: previewData[`wp${nodeType}`].id,
          query,
        },
      })
    })
  )

  // create the homepage
  // const {
  //   data: { allWpPost },
  // } = await graphql(/* GraphQL */ `
  //   {
  //     allWpPost(sort: { fields: modifiedGmt, order: DESC }) {
  //       nodes {
  //         uri
  //         id
  //       }
  //     }
  //   }
  // `)

  // const perPage = 10
  // const chunkedContentNodes = chunk(allWpPost.nodes, perPage)

  // await Promise.all(
  //   chunkedContentNodes.map(async (nodesChunk, index) => {
  //     const firstNode = nodesChunk[0]
  //     const page = index + 1
  //     const offset = perPage * index

  //     await actions.createPage({
  //       component: resolve(`./src/templates/index.js`),
  //       path: page === 1 ? `/blog/` : `/blog/${page}/`,
  //       context: {
  //         firstId: firstNode.id,
  //         page: page,
  //         offset: offset,
  //         totalPages: chunkedContentNodes.length,
  //         perPage,
  //       },
  //     })
  //   })
  // )
}
