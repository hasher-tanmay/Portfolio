import { expect, test, type Page } from '@playwright/test'
import jsQR from 'jsqr'
import { profile, skillsSlug, spreads } from '../src/catalog'
import { spreadPath } from '../src/router'

test('opens the cover and navigates by chapters, project index, arrows, and browser history', async ({ page }) => {
  await page.setViewportSize({ width: 1672, height: 941 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Tanmay’s\s*Portfolio/)
  await expect(page.getByRole('navigation', { name: 'Chapters' })).toHaveCount(0)
  await page.screenshot({ path: test.info().outputPath('cover.png'), animations: 'disabled' })
  await page.getByRole('link', { name: 'Open portfolio' }).click()
  await expect(page.getByRole('heading', { name: 'Under the cover' })).toBeFocused()
  const chapters = page.getByRole('navigation', { name: 'Chapters' })
  await chapters.getByRole('link', { name: 'Projects' }).click()
  const projects = page.getByRole('list', { name: 'Four projects' }).getByRole('link')
  await expect(projects).toHaveCount(4)
  await expect(page.locator('.project-index .project-description')).toHaveText([
    /PySpark pipeline/, /YOLOv8/, /timestamped source excerpts/, /validation-guided sample weighting/,
  ])
  for (const [index, title] of ['Vendor AI Assistant', 'OAK-D-Lite Pothole Detection', 'Transcript App', 'Meta-Contrast'].entries()) {
    await projects.nth(index).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
    await expect(chapters.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'location')
    await page.goBack()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Selected projects')
  }
  await projects.first().click()
  await page.screenshot({ path: test.info().outputPath('vendor.png'), animations: 'disabled' })
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('heading', { name: 'OAK-D-Lite Pothole Detection' })).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/\/vendor-ai-assistant$/)
  await expect(page.getByRole('heading', { name: 'Vendor AI Assistant' })).toBeFocused()
  const controls = page.getByRole('navigation', { name: 'Turn pages' })
  await controls.getByRole('link', { name: 'Next' }).click()
  await expect(page.getByRole('heading', { name: 'OAK-D-Lite Pothole Detection' })).toBeFocused()
  await controls.getByRole('link', { name: 'Previous' }).click()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('OAK-D-Lite Pothole Detection')
  await page.goForward()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vendor AI Assistant')

  await expect(page.getByText('Ask how I built this')).toHaveCount(0)
  await page.getByRole('button', { name: 'Show another 8bit message' }).click()
  await expect(page.locator('.eightbit-bubble')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/vendor-ai-assistant$/)

  await chapters.getByRole('link', { name: 'Résumé' }).click()
  await expect(controls.getByRole('link', { name: 'Next' })).toHaveCount(0)
  await expect(page.getByText('End of log')).toBeVisible()
})

test('opens with the first Right Arrow and settles or cancels two-sided turns', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.cover-turn')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Under the cover' })).toBeFocused()
  await expect(page.getByRole('link', { name: 'Back to cover' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Notebook cover' })).toHaveCount(0)
  const next = page.getByRole('link', { name: 'Next' })
  await page.keyboard.press('ArrowRight')
  const sheet = page.locator('.turn-next .turn-sheet')
  await expect(sheet.locator('.sheet-front')).toContainText('What I work with')
  await expect(sheet.locator('.sheet-back')).toContainText('Skills and Frameworks')
  await next.evaluate((link) => { if (link instanceof HTMLAnchorElement) link.click() })
  await expect(page.getByRole('heading', { name: 'Skills and Frameworks' })).toBeFocused()
  await expect(page).toHaveURL(/\/skills-and-frameworks$/)
  await next.click()
  await expect(page.getByRole('heading', { name: 'Selected projects' })).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('.turn-previous .turn-sheet')).toHaveCount(1)
  const research = page.getByRole('navigation', { name: 'Chapters' }).getByRole('link', { name: 'Research' })
  await research.click()
  await expect(page.locator('.turn-layer')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Research notes' })).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.turn-layer')).toHaveCount(1)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Research notes' })).toBeFocused()
  await expect(page.locator('.turn-layer')).toHaveCount(0)
  await next.click()
  await expect(page.getByRole('heading', { name: 'Certificates' })).toBeFocused()
})

test('keeps the book frame and controls aligned across desktop spreads', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [1024, 768], [1024, 600]] as const) {
    await page.setViewportSize({ width, height })
    let frame: { height: number; controlsTop: number } | undefined
    for (const { slug } of spreads) {
      await page.goto(spreadPath(slug))
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.locator('.book').evaluate((book) => ({
        height: book.getBoundingClientRect().height,
        controlsTop: book.nextElementSibling?.getBoundingClientRect().top ?? 0,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      frame ??= { height: metrics.height, controlsTop: metrics.controlsTop }
      expect(metrics.scrollWidth, `${width}x${height} ${slug}`).toBe(width)
      expect(metrics.height, `${width}x${height} ${slug}`).toBeCloseTo(frame.height, 0)
      expect(metrics.controlsTop, `${width}x${height} ${slug}`).toBeCloseTo(frame.controlsTop, 0)
    }
  }
})

test('opens and refreshes every direct spread URL', async ({ page }) => {
  for (const { slug, title, chapter } of spreads) {
    const url = spreadPath(slug)
    expect((await page.goto(url))?.ok()).toBe(true)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
    expect((await page.reload())?.ok()).toBe(true)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
    await expect(page.getByRole('navigation', { name: 'Chapters' }).locator(`[href="${spreadPath(chapter)}"]`))
      .toHaveAttribute('aria-current', slug === chapter ? 'page' : 'location')
  }
  await page.goto('/spread/vendor-ai-assistant/data-flow')
  await expect(page.getByRole('heading', { name: 'Data flow' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to case study' }).click()
  await expect(page.getByRole('heading', { name: 'Vendor AI Assistant' })).toBeFocused()
  await page.goto('/spread/autonomous-task-worker')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('isn’t in the notebook')
  await page.goto('/spread/unknown')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('isn’t in the notebook')
  await page.getByRole('link', { name: 'Back to cover' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
})

test('replaces old Experiments links without an extra history entry', async ({ page }) => {
  await page.goto(spreadPath('research'))
  await page.goto('/spread/experiments/?from=bookmark#page-2')
  await expect(page).toHaveURL(/\/skills-and-frameworks\?from=bookmark#page-2$/)
  const chapters = page.getByRole('navigation', { name: 'Chapters' })
  await expect(chapters.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  await expect(chapters.getByRole('link', { name: 'Experiments' })).toHaveCount(0)
  await expect(page.locator('.skill-list li')).toHaveCount(12)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Research notes' })).toBeVisible()
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'Skills and Frameworks' })).toBeVisible()
})

async function swipe(page: Page, x: number, y: number, dx: number, dy: number) {
  const cdp = await page.context().newCDPSession(page)
  try {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    for (let step = 1; step <= 8; step++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove', touchPoints: [{ x: x + dx * step / 8, y: y + dy * step / 8 }],
      })
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  } finally {
    await cdp.detach()
  }
}

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true })

  test('taps and swipes one leaf at a time, preserving scroll and history', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Open portfolio' }).tap()
    await expect(page.getByRole('heading', { name: 'Under the cover' })).toBeFocused()
    await expect(page.getByRole('heading', { name: 'What I work with' })).toBeHidden()
    await page.getByRole('link', { name: 'Next' }).tap()
    await expect(page).toHaveURL(/\/about#page-2$/)
    await expect(page.getByRole('heading', { name: 'What I work with' })).toBeFocused()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'What I work with' })).toBeVisible()
    await swipe(page, 300, 295, -185, 0)
    await expect(page).toHaveURL(/\/skills-and-frameworks$/)
    await page.goBack()
    await expect(page.getByRole('heading', { name: 'What I work with' })).toBeVisible()
    await page.goForward()
    await expect(page.getByRole('heading', { name: 'Skills and Frameworks' })).toBeFocused()
    const next = page.getByRole('link', { name: 'Next' })
    await next.click()
    await expect(page.getByRole('heading', { name: 'Agentic AI and forward-deployed engineering' })).toBeFocused()
    await expect(page.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('aria-current', 'location')
    await expect(page.locator('.skill-list li')).toHaveCount(6)
    await next.click()
    await expect(page.getByRole('heading', { name: 'Selected projects' })).toBeVisible()
    await page.goto('/spread/experiments#page-2')
    await expect(page).toHaveURL(new RegExp(`${spreadPath(skillsSlug, 2)}$`))
    await expect(page.getByRole('link', { name: 'AI FDE course outline' })).toBeVisible()

    await page.setViewportSize({ width: 390, height: 600 })
    await page.goto(spreadPath('vendor-ai-assistant', 2))
    await expect(page.getByRole('heading', { name: 'Retailer demo' })).toBeVisible()
    await expect(page.getByRole('img', { name: /Retailer demo asks about the price/ })).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, 0))
    await swipe(page, 35, 500, 3, -265)
    const leaf = page.locator('.leaves > .leaf')
    await expect.poll(() => leaf.evaluate((node) => node.scrollTop)).toBeGreaterThan(0)
    await expect(page).toHaveURL(/\/vendor-ai-assistant#page-2$/)
    await page.evaluate(() => window.scrollTo(0, 0))
    await leaf.evaluate((node) => { node.scrollTop = 0 })
    await page.screenshot({ path: test.info().outputPath('mobile-vendor.png'), animations: 'disabled', fullPage: true })

    await page.setViewportSize({ width: 320, height: 720 })
    for (const { slug } of spreads) {
      for (const leaf of [1, 2] as const) {
        await page.goto(spreadPath(slug, leaf))
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
      }
    }
    await expect(page.getByRole('img', { name: /QR code/ })).toBeVisible()
  })

  test('taps through the skills leaves on a mobile deep link', async ({ page }) => {
    await page.goto(spreadPath(skillsSlug))
    await expect(page.locator('.skill-list li')).toHaveCount(6)
    await page.getByRole('link', { name: 'Next' }).tap()
    await expect(page.getByRole('heading', { name: 'Agentic AI and forward-deployed engineering' })).toBeFocused()
    await expect(page).toHaveURL(/\/skills-and-frameworks#page-2$/)
  })

  test('matches the cover frame for all leaves and scrolls long pages without moving the controls', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const cover = await page.locator('.cover-main').boundingBox()
    for (const { slug } of spreads) {
      for (const side of [1, 2] as const) {
        await page.goto(spreadPath(slug, side))
        await expect(page.locator('.leaves > .leaf')).toHaveCount(1)
        const box = await page.locator('.book').boundingBox()
        expect(box?.width, `${slug} leaf ${side}`).toBeCloseTo(cover?.width ?? 0, 1)
        expect(box?.height, `${slug} leaf ${side}`).toBeCloseTo(cover?.height ?? 0, 1)
      }
    }
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto(spreadPath(skillsSlug, 2))
    const leaf = page.locator('.leaves > .leaf')
    const controls = page.getByRole('navigation', { name: 'Turn pages' })
    const controlsTop = () => controls.evaluate(node => node.getBoundingClientRect().top + window.scrollY)
    const beforeScroll = await controlsTop()
    await leaf.focus()
    await expect(leaf).toBeFocused()
    await leaf.press('End')
    await expect.poll(() => leaf.evaluate(node => node.scrollHeight - node.clientHeight - node.scrollTop)).toBeLessThan(2)
    expect(await controlsTop()).toBeCloseTo(beforeScroll, 1)
    await controls.getByRole('link', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Selected projects' })).toBeFocused()
    await expect.poll(() => leaf.evaluate(node => node.scrollTop)).toBe(0)
  })

  test('preserves one leaf and swipe navigation in phone landscape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(spreadPath(skillsSlug, 2))
    await page.setViewportSize({ width: 844, height: 390 })
    await expect(page.locator('.spread-stage')).toHaveAttribute('data-layout', 'compact')
    await expect(page.locator('.leaves > .leaf')).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'Agentic AI and forward-deployed engineering' })).toBeVisible()
    await expect(page).toHaveURL(/\/skills-and-frameworks#page-2$/)
    await swipe(page, 570, 245, -140, 0)
    await expect(page.getByRole('heading', { name: 'Selected projects' })).toBeFocused()
    await swipe(page, 280, 245, 140, 0)
    await expect(page.getByRole('heading', { name: 'Agentic AI and forward-deployed engineering' })).toBeFocused()
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.locator('.leaves > .leaf')).toHaveCount(1)
    await expect(page).toHaveURL(/\/skills-and-frameworks#page-2$/)
  })

  test('keeps the frame and controls stationary through both adjacent media turns', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(spreadPath('transcript-app', 2))
    const measure = () => page.locator('.book').evaluate(node => {
      const book = node.getBoundingClientRect()
      return [book.width, book.height, (node.nextElementSibling?.getBoundingClientRect().top ?? 0) - book.top]
    })
    const before = await measure()
    await page.getByRole('button', { name: 'Load recording' }).tap()
    const video = page.locator('video')
    await video.press('Space')
    await expect.poll(() => video.evaluate(node => (node as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
    await page.keyboard.press('ArrowRight')
    await expect(page).toHaveURL(/\/transcript-app#page-2$/)
    for (const [name, direction, heading] of [['Next', 'next', 'Meta-Contrast'], ['Previous', 'previous', 'From the walkthrough']] as const) {
      await page.getByRole('link', { name, exact: true }).evaluate(node => {
        if (node instanceof HTMLAnchorElement) {
          node.click()
          node.click()
        }
      })
      await expect(page.locator(`.turn-layer.turn-${direction}`)).toHaveCount(1)
      expect(await measure()).toEqual(before)
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeFocused()
      expect(await measure()).toEqual(before)
    }
  })
})

test('keeps the narrow two-page Skills spread within the reference frame and leaves fine-pointer landscape wide', async ({ page }) => {
  for (const [width, height] of [[761, 900], [768, 1024]] as const) {
    await page.setViewportSize({ width, height })
    const measures = () => page.locator('.book').evaluate(book => [book, ...book.querySelectorAll('.leaves > .leaf')].map(node => {
      const box = node.getBoundingClientRect()
      return [box.width, box.height]
    }))
    await page.goto(spreadPath('about'))
    const ordinary = await measures()
    await page.goto(spreadPath(skillsSlug))
    expect(await measures()).toEqual(ordinary)
    const facing = page.locator('.leaves > .leaf-right')
    await facing.focus()
    await facing.press('End')
    await expect.poll(() => facing.evaluate(node => node.scrollHeight - node.clientHeight - node.scrollTop)).toBeLessThan(2)
    await expect(facing.getByText('Rollout', { exact: true })).toBeInViewport()
  }
  await page.setViewportSize({ width: 844, height: 390 })
  await page.goto(spreadPath(skillsSlug, 2))
  await expect(page.locator('.spread-stage')).toHaveAttribute('data-layout', 'spread')
  await expect(page.locator('.leaves > .leaf')).toHaveCount(2)
})

test('honors reduced motion without breaking routing and focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(spreadPath('vendor-ai-assistant'))
  await expect(page.locator('.turn-layer')).toHaveCount(0)
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await page.getByRole('link', { name: 'Next' }).click()
  await expect(page.getByRole('heading', { name: 'OAK-D-Lite Pothole Detection' })).toBeFocused()
  await expect(page.locator('.turn-layer')).toHaveCount(0)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Vendor AI Assistant' })).toBeFocused()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('link', { name: 'Next' }).click()
  await expect(page.locator('.turn-sheet')).toHaveCSS('animation-name', 'page-turn')
})

test('serves curated media and résumé, plays the recording on demand, and decodes the QR', async ({ page, request }) => {
  await page.goto(spreadPath('oak-d-lite-pothole-detection'))
  await expect(page.getByText(/Harbor/i)).toHaveCount(0)
  await expect(page.locator('video')).toHaveCount(0)
  await page.getByRole('button', { name: 'Load recording' }).click()
  const video = page.locator('video')
  await expect(video).not.toHaveAttribute('autoplay')
  await video.evaluate(async (node) => {
    if (!(node instanceof HTMLVideoElement)) throw new Error('Expected native video')
    await node.play()
  })
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
  await video.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/oak-d-lite-pothole-detection$/)
  const assets = [
    ['/evidence/vendor-catalog.jpg', 'image/jpeg'],
    ['/evidence/vendor-policy.jpg', 'image/jpeg'],
    ['/evidence/transcript-demo.mp4', 'video/mp4'],
    ['/evidence/transcript-demo-poster.jpg', 'image/jpeg'],
    ['/evidence/oak-d-demo.mp4', 'video/mp4'],
    ['/evidence/oak-d-poster.jpg', 'image/jpeg'],
    ['/evidence/meta-contrast-diagram.png', 'image/png'],
    ['/evidence/meta-contrast-conference-paper.pdf', 'application/pdf'],
    ['/evidence/mtech-dissertation.pdf', 'application/pdf'],
    ['/evidence/ai-fde-certificate.pdf', 'application/pdf'],
    ['/evidence/ai-engineer-core-certificate.pdf', 'application/pdf'],
    ['/evidence/fde.png', 'image/png'],
    ['/evidence/llm.png', 'image/png'],
    [profile.resume, 'application/pdf'],
  ] as const
  for (const [url, type] of assets) {
    const response = await request.get(url)
    expect(response.ok(), url).toBe(true)
    expect(response.headers()['content-type'], url).toContain(type)
    if (type === 'application/pdf') expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
  }
  await page.goto(spreadPath('resume'))
  await expect(page.getByRole('link', { name: 'View PDF' })).toHaveAttribute('href', profile.resume)
  await expect(page.getByRole('link', { name: 'Open résumé on Google Drive' })).toHaveAttribute('href', profile.resumeDrive)
  const download = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download PDF' }).click()
  expect((await download).suggestedFilename()).toBe('Tanmay_Patel_Resume.pdf')
  const qr = page.locator('[data-resume-qr]')
  await expect(qr).toBeVisible()
  const pixels = await qr.evaluate(async (node) => {
    const size = 360
    const svg = new XMLSerializer().serializeToString(node)
    const image = new Image()
    image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')
    context.drawImage(image, 0, 0, size, size)
    return Array.from(context.getImageData(0, 0, size, size).data)
  })
  expect(jsQR(Uint8ClampedArray.from(pixels), 360, 360)?.data).toBe(profile.resumeDrive)
  await page.screenshot({ path: test.info().outputPath('resume.png'), animations: 'disabled' })
})

test('links the research evidence and certificates from their intended leaves', async ({ page }) => {
  await page.goto(spreadPath('research'))
  await expect(page.getByText(/96.92% test accuracy versus 94.69%/)).toBeVisible()
  await expect(page.locator('.leaves').getByText(/Table 4.2 tests/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Read the conference paper (PDF)' })).toHaveAttribute('href', '/evidence/meta-contrast-conference-paper.pdf')
  await expect(page.getByRole('link', { name: 'Read the M.Tech dissertation (PDF)' })).toHaveAttribute('href', '/evidence/mtech-dissertation.pdf')
  await page.getByRole('link', { name: 'Meta-Contrast', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Read the conference paper (PDF)' })).toBeVisible()
  await expect(page.getByRole('img', { name: /EfficientNetV2-B0 feeds/ })).toBeVisible()
  const popup = page.waitForEvent('popup')
  await page.getByRole('link', { name: /^Open image:/ }).click()
  await expect(await popup).toHaveURL(/\/evidence\/meta-contrast-diagram\.png$/)
  await page.goto(spreadPath('certificates'))
  for (const [leaf, label] of [['.leaf-left', /AI FDE certificate/], ['.leaf-right', /AI Engineer Core Track certificate/]] as const) {
    const preview = page.locator(leaf).getByRole('img', { name: label })
    await preview.scrollIntoViewIfNeeded()
    await expect.poll(() => preview.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBe(1920)
    await expect.poll(() => preview.evaluate((node) => (node as HTMLImageElement).naturalHeight)).toBe(1080)
  }
  const certificates = page.getByRole('link', { name: 'View certificate (PDF)' })
  await expect(certificates.nth(0)).toHaveAttribute('href', '/evidence/ai-fde-certificate.pdf')
  await expect(certificates.nth(1)).toHaveAttribute('href', '/evidence/ai-engineer-core-certificate.pdf')
  await expect(page.getByRole('link', { name: 'Next' })).toHaveAttribute('href', spreadPath('resume'))
})

test('Transcript App loads, plays, seeks, and enters fullscreen without turning pages', async ({ page }) => {
  await page.goto(spreadPath('transcript-app'))
  await expect(page.locator('figcaption')).toHaveText('Demo of Transcript App')
  const launch = page.getByRole('button', { name: 'Load recording' })
  const before = await launch.boundingBox()
  await launch.click()
  const video = page.locator('video')
  await expect(video).toBeFocused()
  expect((await video.boundingBox())?.height).toBeCloseTo(before?.height ?? 0, 0)
  await expect(video).toHaveAttribute('preload', 'metadata')
  await expect(video).not.toHaveAttribute('autoplay')
  await video.press('Space')
  await expect.poll(() => video.evaluate((node) => {
    if (!(node instanceof HTMLVideoElement)) throw new Error('Expected a video')
    return !node.paused && !node.muted && node.volume > 0 && node.playbackRate === 1 &&
      'webkitAudioDecodedByteCount' in node && Number(node.webkitAudioDecodedByteCount) > 0
  })).toBe(true)
  const duration = await video.evaluate((node) => (node as HTMLVideoElement).duration)
  expect(duration).toBeCloseTo(280.87, 1)
  await video.evaluate((node) => {
    if (!(node instanceof HTMLVideoElement)) throw new Error('Expected a video')
    node.pause()
    node.currentTime = 245
  })
  await expect.poll(() => video.evaluate((node) => {
    const player = node as HTMLVideoElement
    return !player.seeking && Math.abs(player.currentTime - 245) < 0.05
  })).toBe(true)
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/\/transcript-app$/)
  await video.evaluate((node) => node.requestFullscreen())
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.tagName)).toBe('VIDEO')
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/transcript-app$/)
  await page.evaluate(() => document.exitFullscreen())
})
