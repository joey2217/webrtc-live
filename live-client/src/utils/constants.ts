export const FILTERS = [
  {
    label: 'none',
    value: 'none',
  },
  {
    label: 'blur',
    value: 'blur(3px)',
  },
  {
    label: 'grayscale',
    value: 'grayscale(1)',
  },
  {
    label: 'invert',
    value: 'invert(1)',
  },
  {
    label: 'sepia',
    value: 'sepia(1)',
  },
]

export const RTC_CONFIG: RTCConfiguration  = {
  iceServers: [
    // 目前我在用的，免费STUN 服务器
    {
      urls: 'stun:stun.voipbuster.com ',
    },
    // 谷歌的好像都失效了，不过你们可以试试
    {
      urls: 'stun:stun.l.google.com:19301',
      // urls: 'stun:stun.l.google.com:19302',
      // urls: 'stun:stun.l.google.com:19303',
      // ...
    },
    // TURN 服务器,这个对服务器压力太大了，
    // {
    //   urls: 'turn:turn.xxxx.org',
    //   username: 'webrtc',
    //   credential: 'turnserver',
    // },
    // {
    //   urls: 'turn:turn.ap-southeast-1.aliyuncs.com:443?transport=tcp',
    //   username: 'test',
    //   credential: 'test',
    // },
  ],
}
