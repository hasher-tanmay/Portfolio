import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ComponentPropsWithoutRef, type ReactNode, type TouchEvent } from 'react'
import { chapters, profile, spreads, type Link, type Spread } from './catalog'
import { Evidence, EvidencePicture, Glyph } from './Evidence'
import { Eightbit, useEightbit } from './Eightbit'
import { flowPath, toDialogueKey } from './eightbitDialogue'
import { navigate, readingOrder, spreadPath, useRoute, type Direction } from './router'

const compactQuery = '(max-width: 760px), (max-width: 1000px) and (max-height: 500px) and (orientation: landscape) and (pointer: coarse)'
const narrowQuery = '(min-width: 761px) and (max-width: 959px) and (min-height: 700px)'
type Layout = 'compact' | 'narrow' | 'spread'
const getLayout = (): Layout => window.matchMedia(compactQuery).matches ? 'compact'
  : window.matchMedia(narrowQuery).matches ? 'narrow' : 'spread'
function subscribeToViewport(change: () => void) {
  const queries = [compactQuery, narrowQuery].map((query) => window.matchMedia(query))
  for (const query of queries) query.addEventListener('change', change)
  return () => { for (const query of queries) query.removeEventListener('change', change) }
}

const Navigation = createContext<(href: string, direction?: Direction) => void>(navigate)

function NotebookLink({ href, direction, ...props }: Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'onClick'> & {
  href: string
  direction?: Direction
}) {
  const go = useContext(Navigation)
  return <a {...props} href={href} onClick={(event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    go(href, direction)
  }} />
}

function SourceLink({ link: { label, href, download } }: { link: Link }) {
  return <a href={href} download={download} target={download ? undefined : '_blank'} rel="noreferrer">
    {label} <span aria-hidden="true">{download ? '↓' : '↗'}</span>
  </a>
}

function SourceLinks({ links }: { links: Link[] }) {
  return <ul className="source-links">
    {links.map((link) => <li key={link.href}><SourceLink link={link} /></li>)}
  </ul>
}

function Cover({ next = null }: { next?: string | null }) {
  return <section className="cover cover-main" aria-label="Notebook cover">
    <div className="cover-content">
      <p className="eyebrow cover-kicker">Build Log <span> / </span> Vol. 01</p>
      <h1 className="cover-title" tabIndex={-1} data-route-heading="">Tanmay’s<br />Portfolio</h1>
      <div className="cover-byline"><span>{profile.name}</span><span>{profile.title}</span></div>
      {next && <NotebookLink className="outline-action" href={next} direction="next">
        Open portfolio <span aria-hidden="true">→</span>
      </NotebookLink>}
    </div>
  </section>
}

function Notes({ notes, facing = false }: { notes: Spread['notes']; facing?: boolean }) {
  const Heading = facing ? 'h3' : 'h2'
  return notes.map(({ label, text, link }) => <section className="note" key={label}>
    <Heading>{label}</Heading><p>{text}</p>
    {link && <div className="note-link"><SourceLink link={link} /></div>}
  </section>)
}

function SkillList({ groups }: { groups: Spread['notes'] }) {
  return <ul className="skill-list">
    {groups.map(({ label, text }) => <li key={label}><strong>{label}</strong> — {text}</li>)}
  </ul>
}

function Related({ slugs, index, descriptions }: { slugs: string[]; index: boolean; descriptions?: Spread['relatedDescriptions'] }) {
  return <ol className={`related ${index ? 'project-index' : ''}`} aria-label={index ? 'Four projects' : 'Related spreads'}>
    {slugs.map((slug, position) => {
      const target = spreads.find((spread) => spread.slug === slug)
      if (!target) return null
      return <li key={slug}><NotebookLink href={spreadPath(slug)}>
        {index && <span className="link-number">{String(position + 1).padStart(2, '0')}</span>}
        <span>{index && slug === 'endoscopy-image-classification' ? 'Meta-Contrast — Endoscopy Image Classification'
          : target.title}</span>
        <span aria-hidden="true">→</span>
      </NotebookLink>{descriptions?.[slug] && <p className="project-description">{descriptions[slug]}</p>}</li>
    })}
  </ol>
}

function ChapterLinks({ spread }: { spread: Spread }) {
  return <nav className="bookmarks" aria-label="Chapters">
    {chapters.map(({ slug, name }) => (
      <NotebookLink key={slug} href={spreadPath(slug)} aria-current={spread.chapter === slug ? (spread.slug === slug ? 'page' : 'location') : undefined}>
        {name}
      </NotebookLink>
    ))}
  </nav>
}

type BookView = { spread: Spread; index: number; page: 1 | 2 }
type Turn = { from?: BookView; direction: Direction; href: string; id: number; scrollOffsets: number[] }
type Steps = ReturnType<typeof readingOrder>

function Leaf({ view: { spread, index }, side, active = false, scrollable = false, interactive = false, scrollOffset = 0 }: {
  view: BookView; side: 1 | 2; active?: boolean; scrollable?: boolean; interactive?: boolean; scrollOffset?: number
}) {
  const leaf = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (leaf.current) leaf.current.scrollTop = scrollOffset
  }, [scrollOffset])
  const scrollProps = {
    ref: leaf,
    'data-scrollable': scrollable || undefined,
    tabIndex: interactive && scrollable ? 0 : undefined,
    'aria-label': interactive && scrollable ? (side === 1 ? spread.title : spread.facingTitle) : undefined,
  }
  if (side === 1) return (
    <article {...scrollProps} className={`leaf leaf-left${spread.skillGroups ? ' leaf-skills' : ''}`}>
      <p className="eyebrow folio"><span>{chapters.find(({ slug }) => slug === spread.chapter)?.name}</span><span>{String(index + 1).padStart(2, '0')} / {String(spreads.length).padStart(2, '0')}</span></p>
      <h1 tabIndex={-1} data-route-heading={active ? '' : undefined}>{spread.title}</h1>
      <p className="intro">{spread.intro}</p>
      {spread.leftPreview && <EvidencePicture picture={spread.leftPreview} />}
      <Notes notes={spread.notes} />
      {spread.skillGroups && <SkillList groups={spread.skillGroups.technical} />}
      {spread.skillGroups && spread.related && <Related slugs={spread.related} index={false} />}
      {spread.leftLinks && <SourceLinks links={spread.leftLinks} />}
      {spread.images && spread.evidence && <NotebookLink className="flow-link" href={`${spreadPath(spread.slug)}/data-flow`}>View data flow <span aria-hidden="true">→</span></NotebookLink>}
    </article>
  )
  return (
    <article {...scrollProps} className={`leaf leaf-right${spread.skillGroups ? ' leaf-skills' : ''}`}>
      <h2 className="eyebrow facing-title" tabIndex={-1} data-route-heading={active ? '' : undefined}>{spread.facingTitle}</h2>
      {spread.skillGroups && <p className="facing-intro">Completed Edward Donner’s AI FDE course. <SourceLink link={spread.skillGroups.course} /> includes optional topics.</p>}
      {spread.skillGroups && <SkillList groups={spread.skillGroups.training} />}
      {spread.images
        ? <div className="demo-exhibit">{spread.images.map((picture) => <EvidencePicture key={picture.src} picture={picture} />)}</div>
        : spread.evidence && <Evidence exhibit={spread.evidence} />}
      {spread.facingNotes && <Notes notes={spread.facingNotes} facing />}
      {!spread.skillGroups && spread.related && <Related slugs={spread.related} index={spread.slug === 'projects'} descriptions={spread.relatedDescriptions} />}
      {spread.links && <SourceLinks links={spread.links} />}
    </article>
  )
}

function TurningSheet({ from, to, layout, direction, scrollOffsets, finish }: {
  from: BookView; to: BookView; layout: Layout; direction: Direction; scrollOffsets: number[]; finish: () => void
}) {
  const mobile = layout === 'compact'
  const scrollFrom = mobile || (layout === 'narrow' && !!from.spread.skillGroups)
  const scrollTo = mobile || (layout === 'narrow' && !!to.spread.skillGroups)
  const front = direction === 'next' ? 2 : 1
  const back = front === 1 ? 2 : 1
  return (
    <div className={`turn-layer turn-${direction}`} inert aria-hidden="true">
      {!mobile && <div className="stationary-face"><Leaf view={from} side={back} scrollable={scrollFrom} scrollOffset={scrollOffsets[back - 1]} /></div>}
      <div className="turn-sheet" onAnimationEnd={(event) => { if (event.target === event.currentTarget) finish() }}>
        <div className="sheet-face sheet-front"><Leaf view={from} side={mobile ? from.page : front} scrollable={scrollFrom} scrollOffset={scrollOffsets[mobile ? 0 : front - 1]} /></div>
        <div className="sheet-face sheet-back"><Leaf view={to} side={mobile ? to.page : back} scrollable={scrollTo} /></div>
      </div>
    </div>
  )
}

function Book({ current, layout, steps: { next, previous }, turn, finish, mascot }: {
  current: BookView; layout: Layout; steps: Steps; turn: Turn | null; finish: () => void; mascot: ReactNode
}) {
  const { spread, index, page } = current
  const mobile = layout === 'compact'
  const scrollable = mobile || (layout === 'narrow' && !!spread.skillGroups)
  const go = useContext(Navigation)
  const gesture = useRef<{ x: number; y: number } | null>(null)

  function beginTouch(event: TouchEvent) {
    gesture.current = null
    if (!mobile || event.touches.length !== 1 || (event.target instanceof Element &&
      event.target.closest('a,button,video,audio,summary,input,select,textarea,[contenteditable]'))) return
    const point = event.touches.item(0)
    if (point) gesture.current = { x: point.clientX, y: point.clientY }
  }

  function endTouch(event: TouchEvent) {
    const start = gesture.current
    gesture.current = null
    const end = event.changedTouches.item(0)
    if (!mobile || !start || !end) return
    const dx = end.clientX - start.x
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(end.clientY - start.y) * 1.5) return
    const href = dx < 0 ? next : previous
    if (href) go(href, dx < 0 ? 'next' : 'previous')
  }

  return (
    <div className="workspace">
      <ChapterLinks spread={spread} />
      <div className="book" data-narrow-skills={layout === 'narrow' && !!spread.skillGroups || undefined} onTouchStart={beginTouch} onTouchEnd={endTouch} onTouchCancel={() => { gesture.current = null }}>
        <div className="leaves" inert={!!turn}>
          {(!mobile || page === 1) && <Leaf key={`${spread.slug}-left`} view={current} side={1} active interactive scrollable={scrollable} />}
          {(!mobile || page === 2) && <Leaf key={`${spread.slug}-right`} view={current} side={2} active={mobile} interactive scrollable={scrollable} />}
        </div>
        {turn?.from && <TurningSheet key={turn.id} from={turn.from} to={current} layout={layout} direction={turn.direction} scrollOffsets={turn.scrollOffsets} finish={finish} />}
        {mascot}
      </div>
      <nav className="page-controls" aria-label="Turn pages">
        {previous && <NotebookLink href={previous} direction="previous"><span aria-hidden="true">←</span> Previous</NotebookLink>}
        <span className="page-counter">{mobile ? `Page ${page} of 2` : `Spread ${index + 1} of ${spreads.length}`}</span>
        {next ? <NotebookLink href={next} direction="next">Next <span aria-hidden="true">→</span></NotebookLink> : <span className="end-marker">End of log</span>}
      </nav>
    </div>
  )
}

export function App() {
  const route = useRoute()
  const layout = useSyncExternalStore(subscribeToViewport, getLayout)
  const mobile = layout === 'compact'
  const [pending, setPending] = useState<Turn | null>(null)
  const pendingRef = useRef<Turn | null>(null)
  const turnId = useRef(0)
  const view = useRef<HTMLElement>(null)
  const [masthead, setMasthead] = useState<HTMLDivElement | null>(null)
  const lastRoute = useRef('')
  const sawTurn = useRef(false)
  const index = spreads.findIndex(({ slug }) => route.pathname === spreadPath(slug))
  const spread = spreads[index]
  const home = route.pathname === '/'
  const current = spread ? { spread, index, page: route.page } : undefined
  const { next, previous } = readingOrder(home ? 'cover' : index, route.page, mobile)
  const routeHref = spread ? spreadPath(spread.slug, route.page) : route.pathname
  const turn = pending?.href === routeHref ? pending : null
  const dialogueKey = toDialogueKey(spread ? spreadPath(spread.slug, mobile ? route.page : 2) : route.pathname)
  const eightbit = useEightbit(dialogueKey, routeHref, !!turn)
  const mascot = <Eightbit {...eightbit} compact={mobile} buttonHost={spread && mobile ? masthead : undefined} />

  function go(href: string, direction?: Direction) {
    if (href === routeHref) return
    if (direction && pendingRef.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const destination = spreads.some(({ slug }) => spreadPath(slug) === href.split('#')[0])
    const effect = direction && destination && !reducedMotion
      ? { from: current, href, direction, id: ++turnId.current,
          scrollOffsets: Array.from(view.current?.querySelectorAll('.leaves > .leaf') ?? [], (leaf) => leaf.scrollTop) }
      : null
    pendingRef.current = effect
    setPending(effect)
    navigate(href)
  }

  function finish(id: number) {
    if (pendingRef.current?.id !== id) return
    pendingRef.current = null
    setPending(null)
  }

  useLayoutEffect(() => {
    if (!pending) return
    const cancel = () => finish(pending.id)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const unsubscribe = subscribeToViewport(cancel)
    window.addEventListener('popstate', cancel)
    window.addEventListener('hashchange', cancel)
    motion.addEventListener('change', cancel)
    const fallback = window.setTimeout(cancel, 650)
    return () => {
      window.removeEventListener('popstate', cancel)
      window.removeEventListener('hashchange', cancel)
      motion.removeEventListener('change', cancel)
      unsubscribe()
      window.clearTimeout(fallback)
    }
  }, [pending])

  useLayoutEffect(() => {
    if (mobile) return
    function onArrow(event: KeyboardEvent) {
      if (event.defaultPrevented || document.fullscreenElement || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
        || (event.target instanceof Element && event.target.closest('a,button,input,textarea,select,video,audio,summary,[contenteditable],[role="textbox"]'))) return
      const direction = event.key === 'ArrowLeft' ? 'previous' : event.key === 'ArrowRight' ? 'next' : null
      const href = direction === 'previous' ? previous : direction === 'next' ? next : null
      if (!href || !direction) return
      event.preventDefault()
      if (!event.repeat) go(href, direction)
    }
    window.addEventListener('keydown', onArrow)
    return () => window.removeEventListener('keydown', onArrow)
  })

  useLayoutEffect(() => {
    const betweenLeaves = mobile && route.pathname.startsWith('/spread/') && lastRoute.current.startsWith('/spread/')
    if (turn) {
      sawTurn.current = true
      if (!betweenLeaves) window.scrollTo(0, 0)
      return
    }
    const routeKey = `${route.pathname}:${route.page}`
    if (lastRoute.current && (lastRoute.current !== routeKey || sawTurn.current)) {
      if (!betweenLeaves) window.scrollTo(0, 0)
      view.current?.querySelectorAll<HTMLElement>('.leaves > [data-scrollable]').forEach((leaf) => { leaf.scrollTop = 0 })
      view.current?.querySelector<HTMLElement>('[data-route-heading]')?.focus({ preventScroll: true })
    }
    sawTurn.current = false
    lastRoute.current = routeKey
  }, [route.pathname, route.page, turn, mobile])
  useEffect(() => {
    document.title = spread ? `${spread.title} — Tanmay’s Build Log` : 'Tanmay’s Portfolio — Build Log'
  }, [spread])

  const flowSpread = route.pathname === flowPath
    ? spreads.find(({ slug }) => slug === 'vendor-ai-assistant') : undefined
  return (
    <Navigation.Provider value={go}>
      {home ? <main ref={view} className="cover-stage" data-layout={layout}>
          <div className="cover-frame"><Cover next={next} />{mascot}</div>
        </main>
        : current ? <main ref={view} className="spread-stage" data-layout={layout}>
          <div className={`compact-masthead${mobile ? ' eightbit-masthead' : ''}`} ref={mobile ? setMasthead : undefined}>
            <NotebookLink href="/"><Glyph name="book" /> Back to cover</NotebookLink><span>Vol. 01</span>
          </div>
          <Book current={current} layout={layout} steps={{ next, previous }} turn={turn} finish={() => { if (turn) finish(turn.id) }} mascot={mascot} />
          {turn && !turn.from && <div key={turn.id} className="cover-stage cover-turn" inert aria-hidden="true"
            onAnimationEnd={(event) => { if (event.animationName === 'cover-open') finish(turn.id) }}>
            <Cover next={spreadPath('about')} />
          </div>}
        </main>
        : <main ref={view} className="cover-stage exhibit-stage" data-layout={layout}>
          {flowSpread?.evidence ? <section className="detail-panel">
            <p className="eyebrow">{flowSpread.title}</p>
            <h1 tabIndex={-1} data-route-heading="">Data flow</h1>
            <Evidence exhibit={flowSpread.evidence} />
            <NotebookLink className="outline-action" href={spreadPath(flowSpread.slug)}>Back to case study <span aria-hidden="true">→</span></NotebookLink>
            {mascot}
          </section> : <section className="missing">
            <p className="eyebrow">Build Log / 404</p>
            <h1 tabIndex={-1} data-route-heading="">That page isn’t in the notebook.</h1>
            <NotebookLink className="outline-action" href="/">Back to cover <span aria-hidden="true">→</span></NotebookLink>
          </section>}
        </main>}
    </Navigation.Provider>
  )
}
