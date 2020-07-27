import Preview from "./src/preview/Preview"
import React from "react"

export const wrapPageElement = ({ element, props }) => {
  const { pageContext } = props
  if (!!pageContext.preview) {
    return <Preview pageProps={props} element={element} />
  } else {
    return element
  }
}
