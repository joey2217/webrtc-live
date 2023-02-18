import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Steps,
  message,
  Space,
  Input,
} from 'antd'
import type { TabsProps } from 'antd'
import 'webrtc-adapter'
import { RTC_CONFIG } from '../../utils/constants'

// 创建一条由本地计算机到远端的 WebRTC 连接
const pc = new RTCPeerConnection(RTC_CONFIG)

function copyToClipboard(val: string) {
  navigator.clipboard.writeText(val).then(() => {
    message.success('复制成功')
  })
}

const P2p: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null!)
  const remoteVideoRef = useRef<HTMLVideoElement>(null!)

  const [offerSdp, setOffSdp] = useState('')
  const [answerSdp, setAnswerSdp] = useState('')

  const [remoteOfferSdp, setRemoteOffSdp] = useState('')
  const [remoteAnswerSdp, setRemoteAnswerSdp] = useState('')

  const init = async () => {
    const localStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    })
    localVideoRef.current.srcObject = localStream
    // 添加本地流到 pc
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream)
    })

    // 监听远程流，方法一：
    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0]
    }

    // 方法二：你也可以使用 addStream API，来更加详细的控制流的添加
    // const remoteStream: MediaStream = new MediaStream()
    // pc.ontrack = (event) => {
    //   event.streams[0].getTracks().forEach((track) => {
    //     remoteStream.addTrack(track)
    //   })
    //   // 设置远程视频流
    //   remoteVideo.srcObject = remoteStream
    // }
  }

  // 创建 offer（提案）
  const createOffer = async () => {
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const offerSdpStr = JSON.stringify(pc.localDescription)
        setOffSdp(offerSdpStr)
      }
    }
  }
  // 创建 answer
  const createAnswer = async () => {
    const offer = JSON.parse(remoteOfferSdp)
    pc.onicecandidate = async (event) => {
      // Event that fires off when a new answer ICE candidate is created
      if (event.candidate) {
        setAnswerSdp(JSON.stringify(pc.localDescription))
      }
    }
    await pc.setRemoteDescription(offer)
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
  }

  // 添加 answer(应答)
  const addAnswer = async () => {
    const answer = JSON.parse(remoteAnswerSdp)
    if (!pc.currentRemoteDescription) {
      pc.setRemoteDescription(answer)
    }
  }
  return (
    <Row>
      <Col xs={24} md={8}>
        <Card title="本地">
          <video className="w-full" ref={localVideoRef} muted autoPlay />
        </Card>

        <Card title="远程">
          <video className="w-full" ref={remoteVideoRef} muted autoPlay />
        </Card>
      </Col>
      <Col xs={24} md={16}>
        <Card title="第一步 用户1操作" bodyStyle={{ padding: 0 }}>
          <Button onClick={init}>1. 获取视频流</Button>
          <Button onClick={createOffer}>2. 创建Offer</Button>
          <Input.Group compact>
            <Input style={{ width: 'calc(100% - 200px)' }} value={offerSdp} />
            <Button onClick={() => copyToClipboard(offerSdp)}>
              3. 复制offer给用户 2
            </Button>
          </Input.Group>
        </Card>

        <Card title="第二步 用户2操作" bodyStyle={{ padding: 0 }}>
          <Button onClick={init}>1. 获取视频流</Button>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 300px)' }}
              value={remoteOfferSdp}
              onChange={(e) => setRemoteOffSdp(e.target.value)}
            />
            <Button onClick={createAnswer}>
              2. 粘贴用户1 offer 创建Answer
            </Button>
          </Input.Group>
          <Input.Group compact>
            <Input style={{ width: 'calc(100% - 200px)' }} value={answerSdp} />
            <Button onClick={() => copyToClipboard(answerSdp)}>
              3. 复制 answer 给 用户1
            </Button>
          </Input.Group>
        </Card>

        <Card title="第三步 用户1操作" bodyStyle={{ padding: 0 }}>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 200px)' }}
              value={remoteAnswerSdp}
              onChange={(e) => setRemoteAnswerSdp(e.target.value)}
            />
            <Button onClick={addAnswer}>添加Answer</Button>
          </Input.Group>
        </Card>
      </Col>
    </Row>
  )
}

export default memo(P2p)
