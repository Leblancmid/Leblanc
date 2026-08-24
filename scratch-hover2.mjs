import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5219/', { waitUntil: 'networkidle' })
const handle = await page.waitForSelector('.animate-marquee')
await handle.scrollIntoViewIfNeeded()
await page.waitForTimeout(200)

const box = await handle.boundingBox()
console.log('box', box)

await page.mouse.move(box.x + 50, box.y + box.height / 2)
await page.waitForTimeout(300)
const t1 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
await page.waitForTimeout(1200)
const t2 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
console.log('hovered paused?', t1 === t2, t1, t2)

await page.mouse.move(5, 5)
await page.waitForTimeout(300)
const t3 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
await page.waitForTimeout(1200)
const t4 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
console.log('unhovered moving?', t3 !== t4, t3, t4)

await browser.close()
