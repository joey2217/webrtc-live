import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, theme } from 'antd'
import AppMenu from './AppMenu'

const { Content, Header } = Layout

const AppLayout: React.FC = () => {
  const {
    token: { colorText, colorBgContainer },
  } = theme.useToken()

  return (
    <Layout
      className="min-h-screen"
      style={{ color: colorText, backgroundColor: colorBgContainer }}
    >
      <Header className='flex items-center'>
        <div className="logo">LOGO</div>
        <AppMenu />
      </Header>
      <Content style={{ padding: '16px 50px' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default memo(AppLayout)
