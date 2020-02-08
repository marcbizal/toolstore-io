import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledPlainText = styled.pre`
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 12px;
  line-height: 20px;
`

export const PlainText = props => {
  const [text, setText] = useState('Loading...')

  useEffect(() => {
    fetch(props.src)
      .then(response => response.text())
      .then(setText)
  }, [props.src])

  return <StyledPlainText>{text}</StyledPlainText>
}

PlainText.propTypes = {
  src: PropTypes.string.isRequired,
}
