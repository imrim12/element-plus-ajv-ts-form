import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'element-plus-ajv-ts-form',
      entry: 'lib/index.ts',
    },
    rollupOptions: {
      external: ['vue', 'element-plus', 'vee-validate', 'zod'],
    }
  },
  plugins: [
    vue(),
    autoImport({
      imports: [
        'vue',
      ],
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    components({
      resolvers: [
        ElementPlusResolver(),
      ],
    })
  ],
})
