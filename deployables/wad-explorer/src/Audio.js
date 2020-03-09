import React from 'react'
import PropTypes from 'prop-types'

export const Audio = props => (
  <audio controls src={props.src}>
    Your browser does not support the audio tag.
  </audio>
)

Audio.propTypes = {
  src: PropTypes.string.isRequired,
}
