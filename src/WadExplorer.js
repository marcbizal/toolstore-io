import React, { Component } from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import axios from 'axios'
import Tree from './Tree'
import _ from 'lodash'

class WadExplorer extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    onFileSelect: PropTypes.func,
  }

  static defaultProps = {
    onFileSelect: _.noop,
  }

  state = {
    active: [],
    data: null,
  }

  getChildrenStatePath = (path = []) => [
    'data',
    ...path.reduce((acc, cur) => acc.concat(cur, 'children'), []),
  ]

  getStatePath = (path = []) => this.getChildrenStatePath(path).slice(0, -1)

  fetch = (path = []) => {
    const { endpoint } = this.props
    const stringPath = path.join('/')
    const statePath = this.getChildrenStatePath(path)

    return axios
      .get(`${endpoint}/${stringPath}`)
      .then(res =>
        _.mapValues(
          res.data,
          item =>
            item.type === 'directory' ? { ...item, children: [] } : item,
        ),
      )
      .then(data => {
        const nextState = _.set(this.state, statePath, data)
        this.setState(nextState)
        return data
      })
  }

  componentDidMount() {
    this.fetch()
  }

  handleDirectoryClick = (node, path) => {
    const loading = node.children.length === 0

    this.setState(
      _.set(this.state, this.getStatePath(path), {
        ...node,
        open: node.open ? false : true,
        loading,
      }),
    )

    if (loading)
      this.fetch(path).then(() =>
        this.setState(
          _.set(this.state, [...this.getStatePath(path), 'loading'], false),
        ),
      )
  }

  handleFileClick = (node, path) => {
    this.setState({
      active: path,
    })

    this.props.onFileSelect(path)
  }

  handleNodeClick = (node, path) => {
    switch (node.type) {
      case 'directory':
        return this.handleDirectoryClick(node, path)
      case 'file':
      default:
        return this.handleFileClick(node, path)
    }
  }

  render() {
    const { data, active } = this.state
    return (
      data && (
        <div style={{ width: 300 }}>
          <Tree
            data={data}
            active={active}
            onNodeClick={this.handleNodeClick}
            functions={{
              getMeta: node =>
                node.type === 'file' ? prettyBytes(node.size) : '',
            }}
          />
        </div>
      )
    )
  }
}

export default WadExplorer
