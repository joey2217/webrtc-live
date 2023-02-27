import React, { memo, useCallback, useEffect, useState } from 'react'
import { SendOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { io } from 'socket.io-client'

// const socket = io('/')
const socket = io('http://localhost:3000')

interface IMessage {
  type: 'send' | 'receive'
  id: number
  content: string
}

let count = 0

const Chat: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [value, setValue] = useState('')

  const onChatMessage = useCallback(
    (msg: string) => {
      // console.log('chat', msg, value, value === msg)
      if (value && value === msg) {
        setMessages((list) =>
          list.concat({ type: 'send', content: msg, id: count++ })
        )
        setValue('')
      } else {
        setMessages((list) =>
          list.concat({ type: 'receive', content: msg, id: count++ })
        )
      }
    },
    [value]
  )

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      setIsConnected(false)
    })
    socket.on('chat', onChatMessage)
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('chat')
    }
  }, [onChatMessage])
  const onSend = () => {
    if (value !== '') {
      socket.emit('chat', value)
    }
  }
  return (
    <div
      className="overflow-hidden flex flex-col"
      style={{
        height: 'calc(100vh - 96px)',
      }}
    >
      <div className="flex-1">
        <div className="text-center">
          <h3> {isConnected ? '已连接' : '未连接'} </h3>
        </div>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-center mb-1 ${
              m.type === 'send' ? 'justify-end ' : 'justify-start'
            }`}
          >
            <div
              className={`p-2 rounded ${
                m.type === 'send'
                  ? ' bg-green-400 text-black'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div>
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 32px)' }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPressEnter={onSend}
          />
          <Button
            placeholder="chat content"
            icon={<SendOutlined />}
            onClick={onSend}
          ></Button>
        </Input.Group>
      </div>
    </div>
  )
}

export default memo(Chat)
