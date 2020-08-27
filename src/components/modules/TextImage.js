import React from "react"
import styled, { css } from "styled-components"

import Img from "gatsby-image"
import Wysiwyg from "../Wysiwyg"

export default (props) => {
  const { alignImage, image, text } = props

  return (
    <Container alignImage={alignImage}>
      {image?.remoteFile?.childImageSharp?.fluid ? (
        <div className="image-container">
          <Img fluid={image?.remoteFile?.childImageSharp?.fluid} />
        </div>
      ) : (
        image?.sourceUrl && (
          <div className="image-container">
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
  ${({ alignImage }) =>
    alignImage === "Right"
      ? css`
          flex-direction: row-reverse;
        `
      : css`
          flex-direction: row;
        `}
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .image-container {
    margin-bottom: 30px;
  }
  > div {
    width: 100%;
    @media (min-width: 800px) {
      width: calc(50% - 20px);
    }
  }
`
