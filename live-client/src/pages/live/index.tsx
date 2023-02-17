import React, { memo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Space, Button } from 'antd'
import { start } from './trc'

const Live: React.FC = () => {
  let [params] = useSearchParams()

  return (
    <div>
      <div>
        <div>
          <Space>
            <Button onClick={start}>开始</Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default memo(Live)
