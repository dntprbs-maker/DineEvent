import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 배포 시 경로 꼬임 방지를 위해 상대 경로로 변경
})
