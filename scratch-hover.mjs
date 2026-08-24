import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5219/', { waitUntil: 'networkidle' })
await page.waitForSelector('.animate-marquee')

const box = await page.evaluate(() => {
  const el = document.querySelector('.animate-marquee')
  const r = el.getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
})
console.log('box', box)

await page.mouse.move(box.x + 50, box.y + box.h / 2)
await page.waitForTimeout(300)
const t1 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
await page.waitForTimeout(1000)
const t2 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
console.log('hovered same?', t1 === t2, t1, t2)

await page.mouse.move(50, 50)
await page.waitForTimeout(300)
const t3 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
await page.waitForTimeout(1000)
const t4 = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).transform)
console.log('unhovered moving?', t3 !== t4, t3, t4)

await browser.close()
