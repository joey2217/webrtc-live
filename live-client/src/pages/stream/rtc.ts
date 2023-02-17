import { getDisplayMedia } from '../../utils'
/**
 * 发起端逻辑
 */

let localStream
let startPc: RTCPeerConnection
let candidate: {
  sdpMLineIndex: number | null
  sdpMid: string | null
  candidate: string
}[] = []
let offer: any

export async function start() {
  const stream = await getDisplayMedia()
  localStream = stream
  startPc = new RTCPeerConnection()
  stream.getTracks().forEach((track) => {
    startPc.addTrack(track, stream)
  })
  offer = await startPc.createOffer()
  startPc.setLocalDescription(offer)

  startPc.addEventListener('icecandidate', (event) => {
    event.candidate && console.log('icecandidate', event)
    if (event.candidate) {
      candidate.push({
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      })
      console.log('呼叫者的信息：', { offer, candidate })
    }
  })
}
