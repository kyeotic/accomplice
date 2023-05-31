import { defineConfig } from 'npm:vite@^3.1.3'
import react from 'npm:@vitejs/plugin-react@^2.1'
import unocss from 'npm:unocss@0.52.x/vite'
import { defineConfig as unoConfig, presetWind } from 'npm:unocss@0.52.x'

import 'npm:react@^18.2'
import 'npm:react-dom@^18.2/client'
import 'npm:react-router-dom@^6.4'

import 'npm:dexie@3.2.3'
import 'npm:dexie-react-hooks@1.1.3'
import 'npm:markerjs2@^2.29.1'
import 'npm:lodash@4.17.21'
import 'npm:nanoid@4.0.2'
import 'npm:@react-hook/event@1.2.6'
import 'npm:raviger@4.1.2'
import 'npm:@reecelucas/react-use-hotkeys@2.0.0'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
  },
  plugins: [
    unocss(
      unoConfig({
        presets: [presetWind()],
      })
    ),
    react(),
  ],
})
