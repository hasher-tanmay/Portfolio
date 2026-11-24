import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { spreads } from '../src/catalog'
import { eightbitDialogue, flowPath, type DialogueKey } from '../src/eightbitDialogue'
import { spreadPath } from '../src/router'

const trigger = (page: Page) => page.getByRole('button', { name: 'Show another 8bit message' })
const bubble = (page: Page) => page.locator('.eightbit-bubble')
const line = (page: Page) => bubble(page).locator('.eightbit-line')
const pose = (page: Page) => trigger(page).locator('[data-pose]')
const expectOption = async (page: Page, key: DialogueKey) => {
  await expect(bubble(page)).toHaveCount(1)
  await expect(bubble(page)).toBeVisible()
  const options: readonly string[] = eightbitDialogue[key]
  await expect.poll(async () => options.includes(await line(page).innerText())).toBe(true)
}

test('uses the supplied dialogue verbatim and serves one of three non-repeating picks per key', async ({ page }) => {
  const source = readFileSync(new URL('../../assests/8bit-dialogue.md', import.meta.url), 'utf8')
  const entries = [...source.matchAll(/^`(\/[^`]*)`\r?\n\r?\n1\. (.+?)(?: {2})?\r?\n(?: +workingtanmay[^\r\n]*\r?\n)?2\. (.+?)(?: {2})?\r?\n(?: +workingtanmay[^\r\n]*\r?\n)?3\. (.+?)(?: {2})?\r?$/gm)]
  expect(Object.fromEntries(entries.map(([, key, a, b, c]) => [key, [a, b, c]]))).toEqual(eightbitDialogue)
  const keys = ['/', ...spreads.flatMap(({ slug }) => [spreadPath(slug), spreadPath(slug, 2)]), flowPath]
  expect(Object.keys(eightbitDialogue)).toEqual(keys)
  expect(keys).toHaveLength(22)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    let draws = 0
    Math.random = () => [0, .5, .99, .75, .75, .5, 0, .75][draws++ % 8]!
  })
  for (const key of keys as DialogueKey[]) {
    await page.goto(key)
    const seen = new Set<string>()
    for (let attempt = 0; attempt < 3; attempt++) {
      await expectOption(page, key)
      const current = await line(page).innerText()
      seen.add(current)
      await trigger(page).click()
      await expect(line(page)).not.toHaveText(current)
    }
    expect(seen.size).toBe(3)
    const last = await line(page).innerText()
    await page.reload()
    await expectOption(page, key)
    await expect(line(page)).not.toHaveText(last)
  }
})

test('picks all six independent poses and respects reduced motion', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0 })
  await page.goto('/')
  const seen: string[] = []
  for (let i = 0; i < 6; i++) {
    const current = await pose(page).getAttribute('data-pose')
    expect(current).toBeTruthy()
    expect(await pose(page).evaluate((node) => node.getAnimations({ subtree: true }).length)).toBeGreaterThan(0)
    seen.push(current!)
    const next = [.01, .21, .41, .61, .81][i]
    if (next !== undefined) {
      await page.evaluate((value) => { Math.random = () => value }, next)
      await trigger(page).press('Enter')
    }
  }
  expect(seen).toEqual(['idle', 'blink', 'peek', 'wave', 'thinking', 'celebrate'])
  const copy = await line(page).innerText()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(() => pose(page).evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0)
  await expect(line(page)).toHaveText(copy)
  await trigger(page).press('Space')
  await expect(line(page)).not.toHaveText(copy)
  await expect.poll(() => pose(page).evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0)
})

test('keeps greetings current through turns, history, the exhibit and layout changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/spread/about')
  await expectOption(page, '/spread/about#page-2')
  const desktopCopy = await line(page).innerText()
  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(line(page)).toHaveText(desktopCopy)
  await page.setViewportSize({ width: 390, height: 844 })
  await expectOption(page, '/spread/about')
  await page.getByRole('link', { name: 'Next' }).evaluate((node: HTMLElement) => {
    node.click()
    node.click()
  })
  await expect(page.locator('.turn-layer')).toHaveCount(1)
  await expect(bubble(page)).toBeHidden()
  await expect(trigger(page)).toBeDisabled()
  await expectOption(page, '/spread/about#page-2')
  await page.goBack()
  await expectOption(page, '/spread/about')
  await page.goForward()
  await expectOption(page, '/spread/about#page-2')
  await page.goto('/spread/vendor-ai-assistant')
  await page.getByRole('link', { name: 'View data flow' }).click()
  await expectOption(page, flowPath)
  await page.goBack()
  await expectOption(page, '/spread/vendor-ai-assistant')
})

test('pauses the auto-greeting on contact links and leaves requested messages open', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  const email = bubble(page).getByRole('link', { name: 'workingtanmay@gmail.com' })
  const phone = bubble(page).getByRole('link', { name: '+919317687514' })
  await expect(email).toHaveAttribute('href', 'mailto:workingtanmay@gmail.com')
  await expect(phone).toHaveAttribute('href', 'tel:+919317687514')
  await email.hover()
  await page.clock.runFor(6500)
  await expect(email).toBeVisible()
  await phone.focus()
  await page.mouse.move(0, 0)
  await page.clock.runFor(6500)
  await expect(phone).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(bubble(page)).toBeHidden()
  await expect(trigger(page)).toBeFocused()
  await trigger(page).press('Enter')
  await page.clock.runFor(6500)
  await expect(bubble(page)).toBeVisible()
  await bubble(page).getByRole('button', { name: 'Dismiss 8bit message' }).click()
  await expect(bubble(page)).toBeHidden()
  await page.goto('/spread/resume#page-2')
  await expect(phone).toBeVisible()
  await page.clock.runFor(6500)
  await expect(bubble(page)).toBeHidden()
})

test('attaches automatic and tapped mobile bubbles directly beneath 8bit without moving controls', async ({ browser }) => {
  for (const [width, height] of [[400, 650], [320, 568], [844, 390]] as const) {
    const page = await browser.newPage({ isMobile: true, hasTouch: true, viewport: { width, height }, reducedMotion: 'reduce' })
    try {
      const geometry = () => page.evaluate(() => {
        const selectors = '.cover-main,.book,.page-controls,.eightbit-button,.bookmarks a,.outline-action,.recording-launch'
        const rects = Array.from(document.querySelectorAll(selectors), (node) => node.getBoundingClientRect().toJSON())
        return { rects, scroll: [scrollX, scrollY], height: document.documentElement.scrollHeight }
      })
      for (const key of ['/', '/spread/oak-d-lite-pothole-detection#page-2', '/spread/resume#page-2'] as const) {
        await page.goto(key)
        await page.evaluate(() => document.fonts.ready)
        await expectOption(page, key)
        const before = await geometry()
        const button = (await trigger(page).boundingBox())!
        expect(button.width).toBeGreaterThanOrEqual(44)
        expect(before.scroll).toEqual([0, 0])
        async function checkPlacement() {
          const bounds = (await bubble(page).boundingBox())!
          await expect(bubble(page)).toHaveAttribute('data-side', 'attached')
          expect(bounds.x).toBeGreaterThanOrEqual(7)
          expect(bounds.y).toBeGreaterThanOrEqual(7)
          expect(bounds.x + bounds.width).toBeLessThanOrEqual(width - 7)
          expect(bounds.y + bounds.height).toBeLessThanOrEqual(height - 7)
          const placement = await bubble(page).evaluate((node) => {
            const bounds = node.getBoundingClientRect()
            const sprite = document.querySelector('.eightbit-art')!.getBoundingClientRect()
            const shadow = document.querySelector('.eightbit-art .shadow')!.getBoundingClientRect()
            const tail = getComputedStyle(node, '::after')
            const tipX = bounds.left + node.clientLeft + parseFloat(tail.left)
            const tipY = bounds.top + node.clientTop + parseFloat(tail.top)
            const overlaps = (control: Element) => {
              const r = control.getBoundingClientRect()
              return bounds.x < r.right && bounds.right > r.x && bounds.y < r.bottom && bounds.bottom > r.y
            }
            return {
              centerError: tipX - (sprite.left + sprite.width / 2),
              contactError: tipY - shadow.bottom,
              coversTabs: [...document.querySelectorAll('.bookmarks a')].some(overlaps),
              coversControls: [...document.querySelectorAll('.outline-action,.recording-launch,video')].some(overlaps),
            }
          })
          expect(Math.abs(placement.centerError)).toBeLessThan(0.1)
          expect(Math.abs(placement.contactError)).toBeLessThan(0.1)
          expect(placement.coversTabs).toBe(key !== '/')
          expect(placement.coversControls).toBe(false)
          expect(await line(page).evaluate((node) => {
            const rect = node.getBoundingClientRect()
            return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('.eightbit-bubble') === null
          })).toBe(true)
        }
        await checkPlacement()
        if (key === '/' && width === 400) {
          await page.evaluate(() => {
            window.addEventListener('click', (event) => {
              const link = event.target instanceof Element && event.target.closest('.eightbit-contact a')
              if (!link) return
              document.body.dataset.contact = `${link.getAttribute('href')}:${event.defaultPrevented}`
              event.preventDefault()
            })
          })
          for (const [name, href] of [['workingtanmay@gmail.com', 'mailto:workingtanmay@gmail.com'], ['+919317687514', 'tel:+919317687514']]) {
            await bubble(page).getByRole('link', { name }).tap()
            await expect(page.locator('body')).toHaveAttribute('data-contact', `${href}:false`)
          }
          await expect(page).toHaveURL(/\/$/)
        }
        if (width !== 844 && key !== '/spread/resume#page-2') {
          await page.screenshot({ path: test.info().outputPath(`${width}-${key === '/' ? 'cover' : 'oak-d-lite'}-auto.png`) })
        }
        const first = await line(page).innerText()
        await trigger(page).tap()
        await expect(line(page)).not.toHaveText(first)
        await checkPlacement()
        if (width !== 844 && key !== '/spread/resume#page-2') {
          await page.screenshot({ path: test.info().outputPath(`${width}-${key === '/' ? 'cover' : 'oak-d-lite'}-tap.png`) })
        }
        expect(await geometry()).toEqual(before)
        await bubble(page).getByRole('button', { name: 'Dismiss 8bit message' }).tap()
        await expect(bubble(page)).toBeHidden()
        expect(await geometry()).toEqual(before)
        if (key === '/spread/oak-d-lite-pothole-detection#page-2') {
          await page.getByRole('navigation', { name: 'Chapters' }).getByRole('link', { name: 'About' }).tap()
          await expect(page).toHaveURL(/\/spread\/about$/)
        }
      }
    } finally { await page.close() }
  }
})

test('keeps desktop speech above the stationary frame and left of the mascot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const [url, key] of [['/', '/'], ['/spread/about#page-2', '/spread/about#page-2']] as const) {
    await page.goto(url)
    await expectOption(page, key)
    for (const tapped of [false, true]) {
      if (tapped) await trigger(page).click()
      await expect(bubble(page)).not.toHaveAttribute('data-anchored')
      const mascot = (await trigger(page).boundingBox())!
      const speech = (await bubble(page).boundingBox())!
      const frame = (await page.locator('.cover-main,.book').boundingBox())!
      expect(speech.x + speech.width).toBeLessThan(mascot.x)
      expect(speech.y + speech.height).toBeLessThan(frame.y + 8)
      expect(await page.evaluate(() => scrollY)).toBe(0)
    }
  }
})
