const gap = 7
const edge = 8
const blockers = [
  '.compact-masthead a', '.compact-masthead > span', '.bookmarks a',
  '.outline-action', '.recording-launch', 'video', 'audio',
].join(',')

export function placeCompactBubble(button: HTMLButtonElement, bubble: HTMLDivElement) {
  const viewport = window.visualViewport
  const left = (viewport?.offsetLeft ?? 0) + edge
  const top = (viewport?.offsetTop ?? 0) + edge
  const right = left + (viewport?.width ?? innerWidth) - 2 * edge
  const bottom = top + (viewport?.height ?? innerHeight) - 2 * edge
  const anchor = button.getBoundingClientRect()
  if (anchor.bottom <= top || anchor.top >= bottom || anchor.right <= left || anchor.left >= right) {
    bubble.removeAttribute('data-side')
    return
  }

  const stage = button.closest('main')
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))
  const limitWidth = (width: number) => {
    bubble.style.setProperty('--popover-width', `${width}px`)
    return bubble.getBoundingClientRect()
  }
  // The shadow is the sprite's bottom edge and does not move between poses.
  const shadow = button.querySelector('.eightbit-art .shadow')?.getBoundingClientRect()
  if (shadow && stage?.matches('.spread-stage, .cover-stage:not(.exhibit-stage)')) {
    const alignedRight = clamp(anchor.right, left, right)
    const { width } = limitWidth(alignedRight - left)
    const x = clamp(alignedRight - width, left, right - width)
    bubble.style.setProperty('--popover-x', `${x}px`)
    bubble.style.setProperty('--popover-y', `${shadow.bottom}px`)
    bubble.style.setProperty('--popover-tail', `${anchor.left + anchor.width / 2 - x}px`)
    bubble.dataset.side = 'attached'
    return
  }

  const obstacles = Array.from(stage?.querySelectorAll(blockers) ?? [], (node) => node.getBoundingClientRect())
    .filter(({ width, height }) => width > 0 && height > 0)
  const collides = (x: number, y: number, width: number, height: number, obstacle: DOMRect) =>
    x < obstacle.right + 2 && x + width > obstacle.left - 2 &&
    y < obstacle.bottom + 2 && y + height > obstacle.top - 2

  function apply(side: 'left' | 'below' | 'above', x: number, y: number, width: number, height: number) {
    const tail = side === 'left'
      ? clamp(anchor.top + anchor.height / 2 - y, 10, height - 10)
      : clamp(anchor.left + anchor.width / 2 - x, 10, width - 10)
    bubble.style.setProperty('--popover-x', `${x}px`)
    bubble.style.setProperty('--popover-y', `${y}px`)
    bubble.style.setProperty('--popover-tail', `${tail}px`)
    bubble.dataset.side = side
  }

  const beside = anchor.left - gap
  const back = stage?.querySelector('.compact-masthead a')?.getBoundingClientRect()
  for (const start of [left, (back?.right ?? left) + gap]) {
    if (beside - start < 115) continue
    const { width, height } = limitWidth(beside - start)
    const x = beside - width
    const y = clamp(anchor.top + (anchor.height - height) / 2, top, bottom - height)
    if (y + height <= bottom && !obstacles.some((obstacle) => collides(x, y, width, height, obstacle))) {
      apply('left', x, y, width, height)
      return
    }
  }

  const alignedRight = clamp(anchor.right, left, right)
  const { width, height } = limitWidth(alignedRight - left)
  const x = clamp(anchor.right - width, left, right - width)
  let y = Math.max(top, anchor.bottom + gap)
  for (const obstacle of obstacles.sort((a, b) => a.top - b.top)) {
    if (collides(x, y, width, height, obstacle)) y = obstacle.bottom + gap
  }
  if (y + height <= bottom) {
    apply('below', x, y, width, height)
    return
  }
  const above = anchor.top - height - gap
  if (above >= top && !obstacles.some((obstacle) => collides(x, above, width, height, obstacle))) {
    apply('above', x, above, width, height)
    return
  }
  apply('below', x, clamp(y, top, bottom - height), width, height)
}
