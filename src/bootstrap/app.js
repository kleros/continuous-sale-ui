import '../styles/theme.css'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'
import { Col, Layout, Menu, Row } from 'antd'
import { DrizzleProvider, Initializer } from '../temp/drizzle-react-hooks'
import { Helmet } from 'react-helmet'
import Home from '../containers/home'
import { ReactComponent as Logo } from '../assets/images/logo.svg'
import React from 'react'
import drizzle from './drizzle'
import { register } from './service-worker'
import styled from 'styled-components/macro'

const StyledCol = styled(Col)`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: space-evenly;
`
const StyledColRight = styled(Col)`
  align-items: right;
  color: white;
  display: flex;
  height: 64px;
  justify-content: space-evenly;
`
const StyledMenu = styled(Menu)`
  font-weight: bold;
  line-height: 64px !important;
  text-align: center;
`
const StyledLayoutContent = styled(Layout.Content)`
  background: white;
  padding: 0 9.375vw;
`
export default () => (
  <>
    <Helmet>
      <title>Kleros Continuous ICO</title>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i"
        rel="stylesheet"
      />
    </Helmet>
    <DrizzleProvider drizzle={drizzle}>
      <Initializer>
        <BrowserRouter>
          <Layout>
            <Layout.Header>
              <Row>
                <StyledCol span={4}>
                  <Logo />
                </StyledCol>
                <Col span={4}>
                  <StyledMenu mode="horizontal" theme="dark">
                    <Menu.Item key="home">
                      <a href="https://kleros.io">Learn More About Kleros</a>
                    </Menu.Item>
                  </StyledMenu>
                </Col>
                <StyledColRight span={10} offset={6}>
                  <div>Kleros Continuous Sale</div>
                  <div>Start: March 1st 2019. End: March 1st 2020</div>
                </StyledColRight>
              </Row>
            </Layout.Header>
            <StyledLayoutContent>
              <Switch>
                <Route component={Home} exact path="/" />
              </Switch>
            </StyledLayoutContent>
          </Layout>
        </BrowserRouter>
      </Initializer>
    </DrizzleProvider>
  </>
)

register()
