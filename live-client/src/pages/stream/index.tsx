import React, { memo } from 'react'
import { Button, Space } from 'antd'
import {start} from './rtc'

const Stream: React.FC = () => {
    return (
        <div>
            <div>
                <Space>
                    <Button onClick={start}>开始</Button>
                </Space>
            </div>
        </div>
    )
}

export default memo(Stream)
