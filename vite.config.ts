import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import unocss from 'unocss/vite'
import { defineConfig as unoConfig, presetWind } from 'unocss'

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
    solidPlugin(),
  ],
})
