import { defineConfig } from 'npm:vite@^3.1.3'
import react from 'npm:@vitejs/plugin-react@^2.1'
import WindiCSS from 'npm:vite-plugin-windicss@^1.9.0'

import 'npm:react@^18.2'
import 'npm:react-dom@^18.2/client'
import 'npm:react-router-dom@^6.4'

import 'npm:dexie@3.2.3'
import 'npm:dexie-react-hooks@1.1.3'
import 'npm:nanoid@4.0.2'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
  },
  plugins: [
    react(),
    WindiCSS({
      scan: {
        // By default only `src/` is scanned
        dirs: ['src/'],
        // We only have to specify the file extensions we actually use.
        fileExtensions: ['js', 'ts', 'jsx', 'tsx'],
      },
    }),
  ],
})
