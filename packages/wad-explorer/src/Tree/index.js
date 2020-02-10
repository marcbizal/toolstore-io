import React from 'react'
import PropTypes from 'prop-types'

import * as defaultComponents from './defaultComponents'
import defaultFunctions, { noop } from './defaultFunctions'

const Tree = props => {
  const { data, ...restProps } = props

  const components = { ...defaultComponents, ...props.components }
  const functions = { ...defaultFunctions, ...props.functions }

  const nextProps = { ...restProps, components, functions }

  const { NodeList } = components

  return <NodeList {...nextProps} nodes={data} path={[]} root />
}

const componentType = PropTypes.oneOfType([PropTypes.string, PropTypes.func])

Tree.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]).isRequired,
  onNodeClick: PropTypes.func,
  functions: PropTypes.shape({
    getIcon: PropTypes.func,
    getHeader: PropTypes.func,
    getMeta: PropTypes.func,
  }),
  components: PropTypes.shape({
    Node: componentType,
    NodeContainer: componentType,
    NodeIcon: componentType,
    NodeHeader: componentType,
    NodeMeta: componentType,
    NodeList: componentType,
    NodeListContainer: componentType,
  }),
}

Tree.defaultProps = {
  onNodeClick: noop,
  functions: defaultFunctions,
  components: defaultComponents,
}

export default Tree
