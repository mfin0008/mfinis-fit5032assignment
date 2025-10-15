import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
const functionsUrlPrefix = 'https://australia-southeast1-mfinis-fit5032assignment-a61d8.cloudfunctions.net';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(
      {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('md-')
          }
        }
      }
    ),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // ensure that any requests made to the api are redirected to originate from cloud functions URL
  // this prevents cross-origin requests, and having to deal with the browser's pre-flight requests properly
  server: {
    proxy: {
      '/api': {
        target: functionsUrlPrefix,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''), // removes /api from the request
      }
    }
  }
});
