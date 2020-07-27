import React from "react"
import { graphql } from "gatsby"
// import BlogPost from "../../components/template-parts/blog-post"
import PageModules from "../../components/PageModules"
import Layout from "../../components/layout"

import { Heading, Text } from "@chakra-ui/core"

export default ({ data }) => {
  return (
    <Layout>
      <PageModules modules={data?.page?.acf?.modules} />
    </Layout>
  )
}

export const query = graphql`
  query page($id: String!, $nextPage: String, $previousPage: String) {
    page: wpPage(id: { eq: $id }) {
      title
      acf {
        modules {
          __typename
          ... on WpPage_Acf_Modules_Textarea {
            text
          }
          ... on WpPage_Acf_Modules_TextImage {
            alignImage
            image {
              altText
              remoteFile {
                childImageSharp {
                  fluid {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
            text
          }
        }
      }
    }

    nextPage: wpPage(id: { eq: $nextPage }) {
      title
      uri
    }

    previousPage: wpPage(id: { eq: $previousPage }) {
      title
      uri
    }
  }
`
