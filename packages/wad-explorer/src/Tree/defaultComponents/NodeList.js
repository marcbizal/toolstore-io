import React from 'react'
const NodeList = props => {
  const { root, path, nodes, open, components } = props
  const { NodeListContainer, Node } = components
  return (
    <NodeListContainer
      root={root}
      open={root || open}
    >
      {Object.entries(nodes).map(([key, node]) => (
        <Node
          {...props}
          node={{ name: key, ...node }}
          key={key}
          path={path.concat(key)}
        />
      ))}
    </NodeListContainer>
  )
}

export default NodeList
