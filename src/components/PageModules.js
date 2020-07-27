import React from "react"

import Textarea from "./modules/Textarea"
import TextImage from "./modules/TextImage"

export default (props) => {
  const { data, modules } = props

  return (
    <FlexibleContent
      components={{
        Textarea,
        TextImage,
      }}
      rows={modules}
      data={data}
    />
  )
}

const FlexibleContent = (props) => {
  const { rows, components, data } = props
  if (!!rows && !!components) {
    return rows.map((row, index) => {
      const { __typename, ...rowData } = row
      const type = __typename.split("_").slice(-1)[0]
      const Component = !!row && components[type]
      return !!Component ? (
        <Component key={index} {...rowData} {...data} />
      ) : (
        console.warn(`No component found for ${type} type`)
      )
    })
  } else {
    return null
  }
}
