/**
 * One-time image resize script.
 * Run with: node scripts/optimize-images.mjs
 *
 * Resizes large card/gallery images to a web-appropriate width and
 * re-saves them in place so the public/ folder stays lean.
 */
import sharp from 'sharp'
import { stat, rename, unlink } from 'node:fs/promises'
import { join } from 'node:path'

const PUBLIC = new URL('../public', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

// [filename, maxWidth, quality]  – only applied if the file is larger than maxWidth
const JOBS = [
  ['consultancy.jpg',                       900, 78],
  ['enterprise_software_development.jpg',   900, 78],
  ['app_development.jpg',                   900, 78],
  ['web_design.jpg',                        900, 78],
  ['blog_site.jpg',                         900, 78],
  ['design_and_branding.jpg',               900, 78],
  ['rentalbasic_website.png',               1200, 80],
  ['app_logo.png',                          400, 90],
]

async function run() {
  for (const [file, maxWidth, quality] of JOBS) {
    const path = join(PUBLIC, file)
    const tmp = path + '.tmp'
    try {
      const meta = await sharp(path).metadata()
      if (!meta.width) continue

      const ext = file.split('.').pop().toLowerCase()
      const isJpeg = ext === 'jpg' || ext === 'jpeg'
      const needsResize = meta.width > maxWidth

      const pipeline = needsResize ? sharp(path).resize({ width: maxWidth }) : sharp(path)

      isJpeg
        ? await pipeline.jpeg({ quality, mozjpeg: true }).toFile(tmp)
        : await pipeline.png({ quality, compressionLevel: 9 }).toFile(tmp)

      const before = (await stat(path)).size
      const after = (await stat(tmp)).size

      if (after < before) {
        await rename(tmp, path)
        console.log(`✓ ${file}: ${kb(before)} → ${kb(after)} KB (-${pct(before, after)}%)`)
      } else {
        await unlink(tmp)
        console.log(`  ${file}: already optimal, skipped`)
      }
    } catch (e) {
      try { await unlink(tmp) } catch {}
      console.error(`✗ ${file}: ${e.message}`)
    }
  }
}

const kb = (bytes) => (bytes / 1024).toFixed(0)
const pct = (before, after) => Math.round((1 - after / before) * 100)

run()
