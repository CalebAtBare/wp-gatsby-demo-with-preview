import React from "react"
import styled, { css } from "styled-components"

import Parser from "react-html-parser"

import { useTheme } from "@chakra-ui/core"

export default (props) => {
  const { children, ...rest } = props
  const theme = useTheme()
  console.log({ theme })
  return (
    <Container {...rest} theme={theme}>
      {children && Parser(children)}
    </Container>
  )
}

const Container = styled.div`
  ${({ theme }) =>
    theme &&
    css`
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 700;
        line-height: 1.25;
        margin-bottom: 10px;
      }
      h1 {
        font-size: ${theme.fontSizes[`2xl`]};
      }
      h2 {
        font-size: ${theme.fontSizes[`xl`]};
      }
      h3 {
        font-size: ${theme.fontSizes[`lg`]};
      }
      h4 {
        font-size: ${theme.fontSizes[`md`]};
      }
      h5 {
        font-size: ${theme.fontSizes[`sm`]};
      }
      h6 {
        font-size: ${theme.fontSizes[`xs`]};
      }
    `}
`
