import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

const MARKERS = [
  ['C2PA (Content Credentials)', /c2pa|contentauth|Content Credentials|jumbf/i],
  [
    'IPTC DigitalSourceType AI',
    /trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia|compositeSynthetic/,
  ],
  [
    'Tên công cụ AI',
    /\b(Adobe Firefly|Generative Fill|Generative Expand|DALL[·-]?E|Midjourney|Stable Diffusion|SDXL|ComfyUI|NovelAI|Google Imagen|Gemini|OpenAI|Leonardo\.Ai|Runway ?ML|Magic Eraser|Magic Editor)\b/i,
  ],
  ['Tham số prompt (Stable Diffusion)', /(tEXt|iTXt)parameters|"prompt"\s*:\s*\{/],
]

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('Cách dùng: node scripts/check-image-provenance.mjs <ảnh> [ảnh...]')
  process.exit(2)
}

let rejected = 0
for (const file of files) {
  const content = readFileSync(file).toString('latin1')
  const hits = MARKERS.filter(([, pattern]) => pattern.test(content)).map(([label]) => label)
  if (hits.length > 0) {
    rejected += 1
    console.log(`LOẠI  ${basename(file)}: ${hits.join(', ')}`)
  } else {
    console.log(`ĐẠT   ${basename(file)}`)
  }
}
console.log(`${files.length - rejected}/${files.length} ảnh không có dấu vết AI trong metadata`)
process.exit(rejected > 0 ? 1 : 0)
