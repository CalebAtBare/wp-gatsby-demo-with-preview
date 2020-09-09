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

      const nodesTypeName = nodeType.charAt(0).toLowerCase() + nodeType.slice(1)

      const templatePath = `${contentTypeTemplateDirectory}${nodesTypeName}.js`

      const contentTypeTemplate = contentTypeTemplates.find(
        (path) => path === templatePath
      )

      if (!contentTypeTemplate) {
        dd(node)
        reporter.log(``)
        reporter.log(``)
        reporter.panic(
          `[using-gatsby-source-wordpress] No template found at ${templatePath}\nfor single ${nodesTypeName} ${
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
    })
  )
}
