import React, { memo, useEffect, useRef, useState } from 'react'
import { Button, Space, Select } from 'antd'
import {
  BorderOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import {
  getSupportedMimeTypes,
  getUserMedia,
  getDisplayMedia,
  downloadVideo,
} from '../../utils'
import { FILTERS } from '../../utils/constants'

const mimeTypes = getSupportedMimeTypes()
const mimeTypeOptions = mimeTypes.map((m) => ({ value: m }))

let mediaRecorder: MediaRecorder | null = null
let recordedBlobs: Blob[] = []
let localStream: MediaStream | null = null

function onDataAvailable(event: BlobEvent) {
  console.log('handleDataAvailable', event)
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data)
  }
}

const Record: React.FC = () => {
  const videoEl = useRef<HTMLVideoElement>(null)
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [disabled, setDisabled] = useState(false)
  const [filter, setFilter] = useState('none')
  const [mimeType, setMimeType] = useState(mimeTypes[0])

  const onMediaRecorderStop = (event: Event) => {
    console.log('Recorder stopped: ', event)
    console.log('Recorded Blobs: ', recordedBlobs)
    downloadVideo(recordedBlobs)
    setDisabled(false)
    if (videoEl.current) {
      videoEl.current.pause()
      videoEl.current.srcObject = null
    }
    if (mediaRecorder) {
      mediaRecorder = null
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop()
      })
      localStream = null
    }
  }

  const recordScreen = () => {
    getDisplayMedia().then((stream) => {
      if (videoEl.current) {
        localStream = stream
        stream.getVideoTracks()[0].onended = onStopRecord
        videoEl.current.srcObject = stream
        videoEl.current.play()
        recordedBlobs = []
        mediaRecorder = new MediaRecorder(stream, { mimeType })
        mediaRecorder.onstop = onMediaRecorderStop
        mediaRecorder.ondataavailable = onDataAvailable
        mediaRecorder.start()
        setDisabled(true)
      }
    })
  }

  const recordCamera = () => {
    getUserMedia().then((stream) => {
      if (videoEl.current) {
        localStream = stream
        stream.getVideoTracks()[0].onended = onStopRecord
        videoEl.current.srcObject = stream
        videoEl.current.play()
        recordedBlobs = []
        mediaRecorder = new MediaRecorder(stream, { mimeType })
        mediaRecorder.onstop = onMediaRecorderStop
        mediaRecorder.ondataavailable = onDataAvailable
        mediaRecorder.start()
        setDisabled(true)
      }
    })
  }

  const onStopRecord = () => {
    mediaRecorder?.stop()
  }

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop()
        mediaRecorder = null
      }
      if (localStream) {
        localStream = null
      }
      recordedBlobs = []
    }
  }, [])

  const onSnapshot = () => {
    if (canvasEl.current && videoEl.current) {
      const canvas = canvasEl.current
      const context = canvas.getContext('2d')
      if (context) {
        context.filter = filter
        context.drawImage(videoEl.current, 0, 0, canvas.width, canvas.height)
        const el = document.createElement('a')
        // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
        // var MIME_TYPE = "image/png";
        const url = canvas.toDataURL()
        el.href = url
        el.download = `snapshot_${new Date().toLocaleString('zh-CN', {
          hour12: false,
        })}.png`
        el.click()
        setTimeout(() => {
          document.body.removeChild(el)
        }, 100)
      }
    }
  }

  return (
    <div>
      <div className="text-center">
        <Space wrap>
          <Button
            disabled={disabled}
            icon={<PlayCircleOutlined />}
            onClick={recordCamera}
          >
            开始录制(摄像头)
          </Button>
          <Button
            disabled={disabled}
            icon={<PlayCircleOutlined />}
            onClick={recordScreen}
          >
            开始录制(屏幕)
          </Button>
          <Button
            disabled={!disabled}
            icon={<DownloadOutlined />}
            onClick={onStopRecord}
          >
            停止录制
          </Button>
          <Button
            disabled={!disabled}
            icon={<BorderOutlined />}
            onClick={onSnapshot}
          >
            截图
          </Button>
          <Space>
            <span>录制格式:</span>
            <Select
              disabled={disabled}
              className="w-60"
              defaultValue={mimeTypes[0]}
              onChange={setMimeType}
              options={mimeTypeOptions}
            />
          </Space>
          <Space>
            <span>滤镜:</span>
            <Select
              className="w-24"
              defaultValue="none"
              onChange={setFilter}
              options={FILTERS}
            />
          </Space>
        </Space>
      </div>
      <div className="flex justify-center mt-10">
        <video
          controls
          ref={videoEl}
          className="w-1/2 h-1/2"
          style={{
            filter,
          }}
        />
      </div>
      <canvas
        width={1920}
        height={1080}
        ref={canvasEl}
        className="hidden"
        style={{
          filter,
        }}
      />
    </div>
  )
}

export default memo(Record)
