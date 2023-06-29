import { A } from '@solidjs/router'
import config from '../config'

export default function Footer() {
  return (
    <div class="flex justify-between bg-black text-white text-xs px-4 py-0.5">
      <A href="/">{config.appName}</A>
      <A href="/guide">Guide</A>
    </div>
  )
}
