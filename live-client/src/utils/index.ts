const MIME_TYPES = [
  'video/mp4;codecs=h264,aac',
  'video/webm;codecs=h264,opus',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
]

export function getSupportedMimeTypes() {
  return MIME_TYPES.filter((mimeType) => {
    return MediaRecorder.isTypeSupported(mimeType)
  })
}

// 'audio': {'echoCancellation': true},
// 'video': {
//     'deviceId': cameraId,
//     'width': {'min': minWidth},
//     'height': {'min': minHeight}
//     }
// }
export function getUserMedia(
  constraints: MediaStreamConstraints = {
    audio: false,
    video: true,
  }
) {
  return navigator.mediaDevices.getUserMedia(constraints)
}

export function getDisplayMedia(
  options: DisplayMediaStreamOptions = { audio: false, video: true }
) {
  return navigator.mediaDevices.getDisplayMedia(options)
}

//type = 'video/webm'
export function downloadVideo(
  blobs: BlobPart[],
  fileName = '',
  type = 'video/webm'
) {
  const blob = new Blob(blobs, { type })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  let downloadName = fileName
  if (!downloadName) {
    downloadName = `record_${new Date().toLocaleString('zh-CN', {
      hour12: false,
    })}.webm`
  }
  a.download = downloadName
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 100)
}

export function getConnectedDevices(type: MediaDeviceKind) {
  return navigator.mediaDevices.enumerateDevices().then((devices) => {
    const filtered = devices.filter((device) => device.kind === type)
    return filtered
  })
}
