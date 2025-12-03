import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: '/tmp/.vite',
  server: {
    host: '0.0.0.0',
    port: 5174,
    // 캐시 관련 헤더 설정으로 캐시 문제 방지
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
    proxy: {
      '/api-relay': {
        target: 'http://15.164.127.137:5176',
        secure: false,
        changeOrigin: true,
        timeout: 5000,
        proxyTimeout: 10000,
      },
      // '/api': {
      //   target: 'http://10.0.0.30:8080',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/api/, '/api'),
      //   timeout: 5000,
      //   proxyTimeout: 10000,
      // },
      '/driving-status': {
        target: 'http://10.0.0.30:7080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/driving-status/, '/api/v1/metrics/drivingstatus'),
        timeout: 5000,
        proxyTimeout: 10000,
      },
      '/sound-api': {
        target: 'http://10.0.0.30:8501',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sound-api/, '/api/v1'),
        timeout: 5000,
        proxyTimeout: 10000,
      },
      '/yaml-api': {
        target: 'http://10.0.0.30:47099',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/yaml-api/, '/api'),
        timeout: 5000,
        proxyTimeout: 10000,
      },
    },
  },
});
