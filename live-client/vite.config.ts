import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true, //允许跨域设置
        // rewrite: (path)=> path.replace(/~\/socket/,""), //拦截路径去除
      },
    },
  },
})
