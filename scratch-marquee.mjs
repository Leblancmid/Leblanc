import { chromium } from 'playwright'

const base = 'http://localhost:5219'
const outDir = 'C:\\Users\\michaeln\\AppData\\Local\\Temp\\claude\\c--Users-michaeln-Desktop-Dev-Leblanc\\02cdaa97-e15b-4d97-adda-b493925c47b2\\scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Recently listed')
await page.waitForTimeout(200)
await page.screenshot({ path: `${outDir}/450-marquee-t0.png`, clip: { x: 0, y: 380, width: 1440, height: 420 } })

await page.waitForTimeout(2500)
await page.screenshot({ path: `${outDir}/451-marquee-t2500.png`, clip: { x: 0, y: 380, width: 1440, height: 420 } })

// hover test — pause on hover
await page.hover('text=Recently listed')
await page.mouse.move(720, 550)
await page.waitForTimeout(300)
const pos1 = await page.evaluate(() => {
  const el = document.querySelector('.animate-marquee')
  return el ? getComputedStyle(el).transform : null
})
await page.waitForTimeout(1000)
const pos2 = await page.evaluate(() => {
  const el = document.querySelector('.animate-marquee')
  return el ? getComputedStyle(el).transform : null
})
console.log('paused-check', pos1 === pos2, pos1, pos2)

await browser.close()
console.log('ERRORS:', JSON.stringify(errors, null, 2))
console.log('DONE')
