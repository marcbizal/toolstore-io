import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import './Icons'
import Icon from './Icon'
import WadExplorer from './WadExplorer'
import { Flex, Box } from 'rebass'
import './styles.css'
import LightwaveObject from './Lightwave/LightwaveObject'
import styled from 'styled-components'

window.Buffer = require('buffer/').Buffer

const Container = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  padding: 16px;
`

const Header = styled.header`
  margin-bottom: 32px;
  height: 64px;
`

const Main = styled.main`
  flex: 1;
  display: flex;
`

const Sidebar = styled.aside`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  position: relative;
  display: flex;
`

const Content = styled.div`
  flex: 2;
`

const Renderer = () => undefined

const FileRenderers = props => {
  const { selectedFile, children } = props

  if (!selectedFile) return <div />

  const renderer = React.Children.toArray(children).find(element => {
    if (!React.isValidElement(element)) return

    const fileTypeLower = element.props.fileType.toLowerCase()
    const selectedFileLower = selectedFile.toLowerCase()

    return selectedFileLower.endsWith(fileTypeLower)
  })

  const Render = renderer.props.render

  return <Render src={selectedFile} />
}

class App extends Component {
  state = {
    selectedFile: null,
  }

  onFileSelect = path => {
    const serverPath = ['https://wad.toolstore.io/rel', ...path].join('/')
    console.log(serverPath)
    this.setState({ selectedFile: serverPath })
  }

  render() {
    const { selectedFile } = this.state
    return (
      <Container>
        <Header>
          <Icon size={32} />
        </Header>
        <Main>
          <Sidebar>
            <div style={{ position: 'absolute', flex: 1 }}>
              <WadExplorer
                endpoint="https://wad.toolstore.io/rel"
                onFileSelect={this.onFileSelect}
              />
            </div>
          </Sidebar>
          <Content>
            <FileRenderers selectedFile={selectedFile}>
              <Renderer fileType=".bmp" render="img" />
              <Renderer
                fileType=".lwo"
                render={props => (
                  <LightwaveObject
                    style={{ width: '100%', height: '100%' }}
                    src={props.src}
                  />
                )}
              />
            </FileRenderers>
          </Content>
        </Main>
      </Container>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
