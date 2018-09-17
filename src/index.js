import React from 'react'
import ReactDOM from 'react-dom'
import './Icons'
import Icon from './Icon'
import WadExplorer from './WadExplorer'

import './styles.css'

function App() {
  return (
    <div className="App">
      <div style={{ marginBottom: 16 }}>
        <Icon size={32} />
      </div>
      <WadExplorer endpoint="https://wad.toolstore.io/res" />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
