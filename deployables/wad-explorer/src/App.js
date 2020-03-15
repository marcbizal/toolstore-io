import React, { Component } from 'react'
import Icon from './Icon'
import WadExplorer from './WadExplorer'
import { Scrollbars } from 'react-custom-scrollbars'
import './styles.css'
import LightwaveObject from './Lightwave/LightwaveObject'
import styled from 'styled-components'
import { PlainText } from './PlainText'
import LightwaveScene from './Lightwave/LightwaveScene'
import { Audio } from './Audio'

window.Buffer = require('buffer/').Buffer

const Container = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  padding: 16px;
`

const Header = styled.header`
  height: 64px;
  box-shadow: 0 8px 8px #000;
  z-index: 999;
`

const Main = styled.main`
  flex: 1;
  display: flex;
`

const Sidebar = styled.aside`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const Content = styled.div`
  flex: 2;

  padding: 16px;
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

  const Render = renderer
    ? renderer.props.render
    : () => <span>File type not yet supported.</span>

  return <Render src={selectedFile} />
}

export class App extends Component {
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
            <Scrollbars style={{ flex: 1 }}>
              <div style={{ paddingTop: 8, paddingRight: 30 }}>
                <WadExplorer
                  endpoint="https://wad.toolstore.io/rel"
                  onFileSelect={this.onFileSelect}
                />
              </div>
            </Scrollbars>
          </Sidebar>
          <Content>
            <FileRenderers selectedFile={selectedFile}>
              <Renderer fileType=".bmp" render="img" />
              <Renderer fileType=".wav" render={Audio} />
              <Renderer fileType=".txt" render={PlainText} />
              <Renderer fileType=".cfg" render={PlainText} />
              <Renderer fileType=".ae" render={PlainText} />
              <Renderer fileType=".uv" render={PlainText} />
              <Renderer fileType=".x" render={PlainText} />
              <Renderer fileType=".lws" render={LightwaveScene} />
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
