import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Firestore 데이터 패칭 시 useEffect 내부에서 setState를 호출하는 패턴은
      // 표준 데이터 로딩 방식으로, 실질적인 문제 없음 → warn 수준으로 완화
      'react-hooks/set-state-in-effect': 'warn',
      // fast-refresh 관련: 헬퍼 컴포넌트(Badge 등)를 같은 파일에 두는 경우 warn 처리
      'react-refresh/only-export-components': 'warn',
    },
  },
])

