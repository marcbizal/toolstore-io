import styled from 'react-emotion'
const NodeListContainer = styled('ul')`
  color: #c9c9c9;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;

  li:first-child {
    margin-top: ${props => (props.root ? 0 : 8)}px;
  }

  li {
    margin-top: 8px;
  }
`

export default NodeListContainer
