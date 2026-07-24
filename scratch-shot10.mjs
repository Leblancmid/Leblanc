import { chromium } from 'playwright'

const base = 'http://localhost:5192'
const outDir = 'C:\\Users\\michaeln\\AppData\\Local\\Temp\\claude\\c--Users-michaeln-Desktop-Dev-Leblanc\\02cdaa97-e15b-4d97-adda-b493925c47b2\\scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

await page.goto(base + '/for-sale', { waitUntil: 'networkidle' })
await page.waitForSelector('text=For Sale')
await page.screenshot({ path: `${outDir}/90-for-sale-slots-cards.png`, fullPage: true })

await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Leblanc')
await page.waitForTimeout(1200)
await page.screenshot({ path: `${outDir}/91-home-slots-cards.png`, fullPage: true })

await browser.close()
console.log('ERRORS:', JSON.stringify(errors, null, 2))
console.log('DONE')
