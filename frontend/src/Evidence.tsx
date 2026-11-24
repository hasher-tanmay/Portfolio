import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import QRCode from 'qrcode'
import { profile, type Evidence as Exhibit } from './catalog'

export function Glyph({ name }: { name: 'data' | 'document' | 'assistant' | 'book' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      {name === 'data' && <><ellipse cx="16" cy="7" rx="12" ry="4" /><path d="M4 7v17c0 2 5 4 12 4s12-2 12-4V7M4 15c0 2 5 4 12 4s12-2 12-4" /></>}
      {name === 'document' && <path d="M6 3h13l7 7v19H6zM19 3v8h7M10 16h12m-12 5h12m-12 4h9" />}
      {name === 'assistant' && <><path d="M29 14c0 6-6 10-13 10l-9 4 2-6c-4-2-6-4-6-8C3 8 9 4 16 4s13 4 13 10z" /><path d="M10 14h2m3 0h2m3 0h2" /></>}
      {name === 'book' && <path d="M3 6c5-2 9-1 13 2 4-3 8-4 13-2v19c-5-2-9-1-13 2-4-3-8-4-13-2zm13 2v19" />}
    </svg>
  )
}

export function EvidencePicture({ picture }: { picture: Extract<Exhibit, { kind: 'picture' }>['picture'] }) {
  return (
    <figure className="evidence-picture">
      <a href={picture.src} target="_blank" rel="noreferrer" aria-label={`Open image: ${picture.caption}`}>
        <img src={picture.src} alt={picture.alt} width={picture.width} height={picture.height} loading="lazy" />
      </a>
      <figcaption>{picture.caption}</figcaption>
    </figure>
  )
}

function Recording({ src, poster, caption, label, width, height, captions }: Extract<Exhibit, { kind: 'video' }>) {
  const [loaded, setLoaded] = useState(false)
  const player = useRef<HTMLVideoElement>(null)
  useLayoutEffect(() => {
    if (loaded) player.current?.focus({ preventScroll: true })
  }, [loaded])
  return (
    <figure className={`recording ${width > height ? 'recording-wide' : ''}`} style={{ '--recording-ratio': `${width} / ${height}` } as CSSProperties}>
      {loaded
        ? <video ref={player} src={src} poster={poster} controls playsInline preload="metadata" aria-label={label}>
            {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
          </video>
        : <button type="button" className="recording-launch" onClick={() => setLoaded(true)}>
            <img src={poster} alt="" width={width} height={height} />
            <span>Load recording <span aria-hidden="true">▷</span></span>
          </button>}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function ResumeQR() {
  const { modules } = QRCode.create(profile.resumeDrive, { errorCorrectionLevel: 'M' })
  const quietZone = 4
  const dimension = modules.size + quietZone * 2
  let path = ''
  for (let y = 0; y < modules.size; y++) {
    for (let x = 0; x < modules.size; x++) {
      if (modules.get(y, x)) path += `M${x + quietZone} ${y + quietZone}h1v1h-1z`
    }
  }
  return (
    <figure className="resume-qr">
      <svg viewBox={`0 0 ${dimension} ${dimension}`} role="img" aria-label="QR code for Tanmay Patel’s résumé on Google Drive" shapeRendering="crispEdges" data-resume-qr="">
        <rect width={dimension} height={dimension} fill="white" />
        <path d={path} fill="black" />
      </svg>
      <figcaption><a href={profile.resumeDrive} target="_blank" rel="noreferrer">Open résumé on Google Drive <span aria-hidden="true">↗</span></a></figcaption>
    </figure>
  )
}

export function Evidence({ exhibit }: { exhibit: Exhibit }) {
  switch (exhibit.kind) {
    case 'picture': return <EvidencePicture picture={exhibit.picture} />
    case 'video': return <Recording {...exhibit} />
    case 'resume': return <ResumeQR />
    case 'metrics': return (
      <figure className="metrics">
        <dl>{exhibit.metrics.map(({ value, label }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <figcaption>{exhibit.caption}</figcaption>
      </figure>
    )
    case 'flow': return (
      <figure className="flow" role="img" aria-label={exhibit.label}>
        <div aria-hidden="true">
          <div className="flow-branches">
            {exhibit.branches.map(({ steps, icon }) => (
              <div className="flow-branch" key={icon}>
                <Glyph name={icon} />
                {steps.map((step, index) => <div key={step}>{index > 0 && <span className="flow-arrow">↓</span>}<span className={index > 0 ? 'flow-box' : undefined}>{step}</span></div>)}
              </div>
            ))}
          </div>
          <div className="flow-arrow flow-merge">↘ <span>↙</span></div>
          <div className="flow-box flow-output"><Glyph name="assistant" />{exhibit.output}</div>
        </div>
      </figure>
    )
  }
}
