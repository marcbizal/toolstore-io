import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Node = props => {
  const {
    node,
    path,
    onNodeClick,
    active,
    functions,
    styles,
    components,
  } = props
  const { getIcon, getHeader, getMeta } = functions
  const { NodeContainer, NodeIcon, NodeHeader, NodeMeta, NodeList } = components

  const isActive = path.join('/') === active.join('/')

  const nextProps = { ...props, root: false }
  return (
    <NodeContainer isActive={isActive}>
      <NodeHeader
        onClick={event => {
          event.stopPropagation()
          onNodeClick(node, path)
        }}
      >
        <NodeIcon node={node} getIcon={getIcon} />
        {getHeader(node)}
        <NodeMeta>
          {typeof node.loading !== 'undefined' && node.loading ? (
            <FontAwesomeIcon
              icon="circle-notch"
              spin
              style={{ marginLeft: 8 }}
            />
          ) : (
            getMeta(node)
          )}
        </NodeMeta>
      </NodeHeader>
      {node.children && (
        <NodeList
          {...nextProps}
          open={node.children && node.open}
          nodes={node.children}
          path={path}
        />
      )}
    </NodeContainer>
  )
}

export default Node
