import React from "react"
import styled from "styled-components"

import Parser from "react-html-parser"

// import { useTheme } from "@chakra-ui/core"

export default (props) => {
  const { children, ...rest } = props
  // const theme = useTheme()
  // console.log({ theme })
  return <Container {...rest}>{children && Parser(children)}</Container>
}

const Container = styled.div``
