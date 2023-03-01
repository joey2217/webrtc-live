import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://162.14.110.244:8100/',
        // ws: true,
        changeOrigin: true, //允许跨域设置
        // rewrite: (path)=> path.replace(/~\/socket/,""), //拦截路径去除
      },
    },
  },
})
