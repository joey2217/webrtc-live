# webrtc-live

https://juejin.cn/post/7073725449162981384

https://webrtc.github.io/samples/

```ts
export const pc1 = new RTCPeerConnection()
pc1.addEventListener('icecandidate', async (e) => {
  if (e.candidate) {
    await pc2.addIceCandidate(e.candidate)
  }
})
pc1.addEventListener('iceconnectionstatechange', (e) => {
  console.log('pc1: iceconnectionstatechange', e)
})

const pc2 = new RTCPeerConnection()
pc2.addEventListener('icecandidate', async (e) => {
  if (e.candidate) {
    await pc1.addIceCandidate(e.candidate)
  }
})

pc2.addEventListener('iceconnectionstatechange', (e) => {
  console.log('pc2: iceconnectionstatechange', e)
})

pc2.addEventListener('track', (e) => {
  if (e.streams.length > 0) {
    remoteVideo.srcObject = e.streams[0]
  }
})

const remoteVideo = document.querySelector('#remoteVideo') as HTMLVideoElement
const localVideo = document.querySelector('#localVideo') as HTMLVideoElement

async function pushStream(answer: RTCSessionDescriptionInit) {
  pc1.setRemoteDescription(answer)
}

async function pullStream(offer: RTCSessionDescriptionInit): Promise<void> {
  pc2.setRemoteDescription(offer)
  const answer = await pc2.createAnswer()
  pc2.setLocalDescription(answer)
  console.warn('answer', answer)
  pushStream(answer)
}

window.onload = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })

  localVideo.srcObject = localStream
  localStream.getTracks().forEach((track) => pc1.addTrack(track, localStream))

  const offer = await pc1.createOffer()
  pc1.setLocalDescription(offer)
  console.warn('pc1 offer', offer)
  pullStream(offer)
}
```