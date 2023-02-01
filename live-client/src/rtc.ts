// 本地实例
export const pc1 = new RTCPeerConnection()
// 对端实例
export const pc2 = new RTCPeerConnection()

// 告诉对端，本端地址
pc1.addEventListener('icecandidate', async (e) => {
  // 发送给对端
  // 对端添加本端地址
  if (e.candidate) {
    await pc2.addIceCandidate(e.candidate)
  }
})

pc2.addEventListener('icecandidate', async (e) => {
  // 发送给本端
  // 本端添加对端地址
  if (e.candidate) {
    await pc1.addIceCandidate(e.candidate)
  }
})

// 创建本端SDP,告诉本端浏览器支持哪些能力
const offer = await pc1.createOffer()
pc1.setLocalDescription(offer)
// 创建远端SDP,告诉远端浏览器支持哪些能力
const answer = await pc2.createAnswer()
pc2.setLocalDescription(answer)
// 。。。。发送远端SDP给本端
// 接收远端sdp,告诉远端浏览器支持哪些能力
pc1.setRemoteDescription(answer)
// 接收客户端sdp,告诉远端浏览器支持哪些能力
pc2.setRemoteDescription(offer)
