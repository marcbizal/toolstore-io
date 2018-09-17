import React from 'react'
const NodeList = props => {
  const { root, path, nodes, open, styles, components } = props
  const { NodeListContainer, Node } = components
  return (
    <NodeListContainer
      root={root}
      className={`${root || open ? styles.openNode : styles.closedNode}`}
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
