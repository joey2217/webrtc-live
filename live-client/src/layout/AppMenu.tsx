import React, { memo } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Link, useLocation } from 'react-router-dom'

const items: MenuProps['items'] = [
  {
    label: <Link to="/">Home</Link>,
    key: '/',
  },
  {
    label: <Link to="/stream">开播</Link>,
    key: '/stream',
  },
  {
    label: <Link to="/live">直播</Link>,
    key: '/live',
  },
  {
    label: <Link to="/record">录制</Link>,
    key: '/record',
  },
]

const AppHeader: React.FC = () => {
  const location = useLocation()
  return (
    <Menu
      className="flex-1"
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location.pathname]}
      items={items}
    />
  )
}

export default memo(AppHeader)