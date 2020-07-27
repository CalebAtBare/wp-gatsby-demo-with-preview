import React from "react"
import styled from "styled-components"

import Img from "gatsby-image"
import Wysiwyg from "../Wysiwyg"

export default (props) => {
  const { image, text } = props
  console.log({ image })
  return (
    <Container>
      {image?.remoteFile?.childImageSharp?.fluid ? (
        <div>
          <Img fluid={image?.remoteFile?.childImageSharp?.fluid} />
        </div>
      ) : (
        image?.sourceUrl &&
        image?.srcSet && (
          <div>
            <img src={image.sourceUrl} srcSet={image.srcSet} />
          </div>
        )
      )}
      {text && (
        <div>
          <Wysiwyg>{text}</Wysiwyg>
        </div>
      )}
    </Container>
  )
}

const Container = styled.div`
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > div {
    width: 100%;
    @media (min-width: 800px) {
      width: calc(50% - 20px);
    }
  }
`
