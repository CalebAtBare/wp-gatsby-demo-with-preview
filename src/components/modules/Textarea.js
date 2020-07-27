import React from "react"
import styled from "styled-components"

import Wysiwyg from "../Wysiwyg"

export default (props) => {
  const { text, edges, ...rest } = props
  return <Container {...rest}>{text && <Wysiwyg>{text}</Wysiwyg>}</Container>
}

const Container = styled.div`
  margin: 30px 0;
`
