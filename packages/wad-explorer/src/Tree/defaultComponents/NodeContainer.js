import styled, { css } from 'styled-components'
const NodeContainer = styled('li')`
  cursor: pointer;

  ${props => props.isActive && css`
    color: #fff;
  `}

  &:hover {
    color: #fff;
  }

  ul {
    margin-left: 16px;
  }
`

export default NodeContainer
