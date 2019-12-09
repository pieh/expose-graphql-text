/* eslint-disable */

import React from "react"

const Wrapper = ({ element, props }) => {
  const {
    componentChunkNameCustom,
    isCreatedByStatefulCreatePages,
    ...context
  } = props.pageContext

  return (
    <>
      {element}
      <div>
        Query:
        <pre>{QUERIES[componentChunkNameCustom]}</pre>
        Variables:
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </div>
    </>
  )
}

export default Wrapper
