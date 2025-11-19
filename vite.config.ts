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
      '/api': {
        target: 'http://10.0.0.30:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        timeout: 5000,
        proxyTimeout: 10000,
      },
    },
  },
});
