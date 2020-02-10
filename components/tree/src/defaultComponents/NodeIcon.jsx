import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NodeIcon = props => {
  const { node, getIcon } = props
  return (
    <FontAwesomeIcon style={{ width: 32 }} icon={node.icon || getIcon(node)} />
  )
}

export default NodeIcon
