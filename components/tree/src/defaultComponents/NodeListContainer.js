import styled, { css } from 'styled-components'
const NodeListContainer = styled('ul')`
  color: #c9c9c9;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;

  ${props => props.open ? css`
    height: auto;
    opacity: 1;
  ` : css`
    height: 0px;
    opacity: 0;
  `}

  li:first-child {
    margin-top: ${props => (props.root ? 0 : 8)}px;
  }

  li {
    margin-top: 8px;
  }
`

export default NodeListContainer
