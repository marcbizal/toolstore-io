import React from 'react'
import Brick1x1 from './Brick1x1'
import styled from 'react-emotion'

const IconContainer = styled('div')`
  display: flex;
  align-items: center;
`

const IconText = styled('span')`
  font-family: 'Muli', sans-serif;
  text-rendering: optimizeLegibility;
  font-size: ${props => (props.size / 4) * 3}px;
  margin-left: ${props => props.size / 4}px;
`

const ToolstoreGradient = ({ id }) => (
  <radialGradient
    cx="50%"
    cy="0%"
    fx="50%"
    fy="0%"
    r="100%"
    gradientTransform="translate(0.500000,0.000000),scale(1.000000,0.800000),rotate(90.000000),translate(-0.500000,-0.000000)"
    id={id}
  >
    <stop stopColor="#02EFFF" offset="0%" />
    <stop stopColor="#3AD0FD" offset="50%" />
    <stop stopColor="#8277F3" offset="100%" />
  </radialGradient>
)

export default ({
  size = 48,
  showText = true,
  gradient = <ToolstoreGradient id="radialGradient" />,
}) => (
  <IconContainer>
    <Brick1x1 style={{ height: size }} gradient={gradient} />
    {showText && <IconText size={size}>toolstore</IconText>}
  </IconContainer>
)
