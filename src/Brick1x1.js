import React from 'react'
export default ({ gradient, ...restProps }) => (
  <svg {...restProps} viewBox="0 0 400 500" version="1.1">
    <title>toolstore</title>
    <defs>
      {gradient}
      <linearGradient x1="25%" y1="50%" x2="100%" y2="50%" id="studGradient">
        <stop stopColor="#E0E0E0" offset="0%" />
        <stop stopColor="#EEEEEE" offset="100%" />
      </linearGradient>
    </defs>
    <g id="1x1-brick">
      <g id="1x1-brick-mask" fill={`url(#${gradient.props.id})`}>
        <path d="M104.965616,47.517192 C112.525907,38.3023338 128.229226,30.5641337 148.671737,25.6641254 L200,0 L251.32824,25.6641199 C271.770774,30.5641337 287.474093,38.3023338 295.034384,47.517192 L400,100 L400,400 L200,500 L1.26217745e-29,400 L1.26217745e-29,100 L104.965616,47.5171921 Z" />
      </g>
      <g style={{ mixBlendMode: 'multiply' }}>
        <g>
          <path
            d="M400,100 L400,400 L200,500 L-1.8189894e-12,400 L-1.8189894e-12,100 L200,0 L400,100 Z"
            id="Box"
            fill="#FFFFFF"
          />
          <polygon
            id="Right-Side"
            fill="#E0E0E0"
            points="-1.8189894e-12 400 200 500 200 200 -1.8189894e-12 100"
          />
          <polygon
            id="Left-Side"
            fill="#EEEEEE"
            transform="translate(300.000000, 300.000000) scale(-1, 1) translate(-300.000000, -300.000000) "
            points="200 400 400 500 400 200 200 100"
          />
          <g id="Stud" transform="translate(100.000000, 20.000000)">
            <g>
              <ellipse
                id="Oval"
                fill="url(#studGradient)"
                cx="100"
                cy="80"
                rx="100"
                ry="40"
              />
              <rect
                id="Path"
                fill="url(#studGradient)"
                x="0"
                y="40"
                width="200"
                height="40"
              />
              <ellipse
                id="Oval"
                fill="#FFFFFF"
                cx="100"
                cy="40"
                rx="100"
                ry="40"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)
