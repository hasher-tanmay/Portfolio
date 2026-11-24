import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { eightbitDialogue, hiringContact, type DialogueKey } from './eightbitDialogue'
import { placeCompactBubble } from './eightbitPlacement'
import './eightbit.css'

const poses = ['idle', 'blink', 'peek', 'wave', 'thinking', 'celebrate'] as const
const options = [0, 1, 2] as const
const greetingDuration = 6000
const storageKey = 'notebook:8bit:last-lines'

function choose<T>(values: readonly T[], previous: T | undefined): T {
  const choices = values.filter((value) => value !== previous)
  return choices[Math.floor(Math.random() * choices.length)]!
}

function readLastLines(): Map<string, number> {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? '[]')
    if (Array.isArray(saved)) {
      return new Map(saved.filter((pair): pair is [string, number] =>
        Array.isArray(pair) && typeof pair[0] === 'string' && options.some((index) => index === pair[1])))
    }
  } catch { /* Keep tab memory in React if browser storage is unavailable. */ }
  return new Map()
}

type Message = {
  visit: string
  key: DialogueKey
  text: string
  pose: typeof poses[number]
  id: number
  automatic: boolean
}

export function useEightbit(key: DialogueKey | null, route: string, turning: boolean) {
  const [history] = useState(readLastLines)
  const lastPose = useRef<Message['pose'] | undefined>(undefined)
  const shownVisit = useRef<string | null>(null)
  const serial = useRef(0)
  const [active, setActive] = useState<Message | null>(null)
  const visit = key && !turning ? `${route}|${key}` : null

  function pick(dialogueKey: DialogueKey, visitKey: string, automatic: boolean) {
    const previous = history.get(dialogueKey)
    const index = choose(options, options.find((option) => option === previous))
    history.set(dialogueKey, index)
    try { sessionStorage.setItem(storageKey, JSON.stringify([...history])) } catch { /* Tab memory is still available. */ }
    const pose = choose(poses, lastPose.current)
    lastPose.current = pose
    setActive({ visit: visitKey, key: dialogueKey, text: eightbitDialogue[dialogueKey][index], pose, id: ++serial.current, automatic })
  }

  useLayoutEffect(() => {
    if (shownVisit.current === visit) return
    shownVisit.current = visit
    if (key && visit) pick(key, visit, true)
    else setActive(null)
  }, [key, visit])

  const dismiss = useCallback((id: number) => setActive((message) => message?.id === id ? null : message), [])
  return {
    message: active?.visit === visit ? active : null,
    enabled: !!visit,
    next: () => { if (key && visit) pick(key, visit, false) },
    dismiss,
  }
}

type EightbitState = ReturnType<typeof useEightbit>

export function Eightbit({ message, enabled, next, dismiss, buttonHost, compact }: EightbitState & {
  buttonHost?: HTMLElement | null; compact: boolean
}) {
  const id = useId()
  const button = useRef<HTMLButtonElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number>()
  const [focused, setFocused] = useState<number>()
  const [fading, setFading] = useState<number>()
  const timer = useRef({ id: 0, remaining: greetingDuration })
  const messageId = message?.id
  const automatic = message?.automatic
  const paused = !!messageId && (hovered === messageId || focused === messageId)
  const contact = message?.key === '/' || message?.key === '/spread/resume#page-2'

  useLayoutEffect(() => {
    const panel = bubble.current
    const anchor = button.current
    if (!messageId || !panel || !anchor) return
    if (!compact) {
      if (!automatic && panel.getBoundingClientRect().bottom > window.innerHeight) {
        panel.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
      }
      return
    }
    const position = () => placeCompactBubble(anchor, panel)
    const viewport = window.visualViewport
    let frame = 0
    let active = true
    const schedule = () => {
      if (frame || !active) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        position()
      })
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(anchor.closest('main') ?? anchor)
    observer.observe(anchor)
    position()
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)
    viewport?.addEventListener('resize', schedule)
    viewport?.addEventListener('scroll', schedule)
    void document.fonts.ready.then(schedule)
    return () => {
      active = false
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
      viewport?.removeEventListener('resize', schedule)
      viewport?.removeEventListener('scroll', schedule)
      panel.removeAttribute('data-side')
    }
  }, [messageId, automatic, compact, buttonHost])

  useEffect(() => {
    if (!messageId || !automatic) return
    if (timer.current.id !== messageId) timer.current = { id: messageId, remaining: greetingDuration }
    if (paused) return
    const started = performance.now()
    const delay = timer.current.remaining
    const fade = window.setTimeout(() => setFading(messageId), Math.max(0, delay - 240))
    const timeout = window.setTimeout(() => dismiss(messageId), delay)
    return () => {
      window.clearTimeout(fade)
      window.clearTimeout(timeout)
      timer.current.remaining = Math.max(0, timer.current.remaining - (performance.now() - started))
    }
  }, [messageId, automatic, paused, dismiss])

  useEffect(() => {
    if (!messageId) return
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || document.fullscreenElement) return
      if (bubble.current?.contains(document.activeElement)) button.current?.focus({ preventScroll: true })
      dismiss(messageId)
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [messageId, dismiss])

  const trigger = (
    <button className="eightbit-button" ref={button} type="button" aria-label="Show another 8bit message"
        aria-expanded={!!message} aria-controls={id} disabled={!enabled} onClick={next}>
        <span className="eightbit-art" aria-hidden="true" key={message?.id ?? 'rest'} data-pose={message?.pose}>
          <span className="part shadow" />
          <span className="sprite">
            <span className="part foot foot-left" /><span className="part foot foot-right" />
            <span className="part hand hand-left" /><span className="part shell" />
            <span className="part screen" /><span className="part eye eye-left" /><span className="part eye eye-right" />
            <span className="part mouth" /><span className="part dial" /><span className="part vent" />
            <span className="part ribbon" /><span className="part hand hand-right" /><span className="part spark" />
          </span>
        </span>
    </button>
  )

  const speech = (
      <div id={id} className="eightbit-bubble" ref={bubble} data-anchored={compact || undefined}
        data-open={!!message} data-fading={!!message && fading === messageId && !paused}
        onMouseEnter={() => setHovered(messageId)} onMouseLeave={() => setHovered(undefined)}
        onFocus={() => setFocused(messageId)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(undefined) }}>
        <p className="eightbit-line">{message?.text}</p>
        {contact && <p className="eightbit-contact">
          <a href={`mailto:${hiringContact.email}`}>{hiringContact.email}</a>
          <span aria-hidden="true"> · </span>
          <a href={`tel:${hiringContact.phone}`}>{hiringContact.phone}</a>
        </p>}
        {message && <button type="button" className="eightbit-close" aria-label="Dismiss 8bit message"
          onClick={() => { button.current?.focus({ preventScroll: true }); dismiss(message.id) }}>×</button>}
      </div>
  )

  return (
    <div className="eightbit">
      {buttonHost === undefined ? trigger : buttonHost && createPortal(trigger, buttonHost)}
      <span className="eightbit-announcement" role="status">{message && !message.automatic ? message.text : ''}</span>
      {compact ? createPortal(speech, document.body) : speech}
    </div>
  )
}
