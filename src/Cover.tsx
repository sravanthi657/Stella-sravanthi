import { useEffect, useMemo, useState } from 'react'
import { profile } from './data'

export const Nav = () => (
  <nav className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-sm">
      <a href="#top" className="font-display font-semibold text-snow">{profile.name}</a>
      <div className="hidden gap-6 text-fog md:flex">
        <a className="hover:text-snow" href="#work">Work</a>
        <a className="hover:text-snow" href="#notes">Notes</a>
        <a className="hover:text-snow" href="#experience">Experience</a>
        <a className="hover:text-snow" href="#code">Code</a>
      </div>
      <a href={profile.resume} className="rounded-md bg-accent px-3 py-1.5 font-medium text-ink hover:bg-accent-deep">Resume</a>
    </div>
  </nav>
)

// tokenized terminal script: c = colour class
type Tok = { t: string; c?: string }
const LINES: Tok[][] = [
  [{ t: '$ ', c: 'text-fog' }, { t: 'cat stella.ts', c: 'text-snow' }],
  [{ t: 'const ', c: 'text-violet-400' }, { t: 'stella', c: 'text-snow' }, { t: ' = {', c: 'text-fog' }],
  [{ t: '  role: ', c: 'text-fog' }, { t: "'Software Engineer'", c: 'text-accent' }, { t: ',', c: 'text-fog' }],
  [{ t: '  builds: ', c: 'text-fog' }, { t: "'communication products'", c: 'text-accent' }, { t: ',', c: 'text-fog' }],
  [{ t: '  stack: ', c: 'text-fog' }, { t: "['React', 'TypeScript', 'Python', 'Go']", c: 'text-accent' }, { t: ',', c: 'text-fog' }],
  [{ t: '  currently: ', c: 'text-fog' }, { t: "'AI voice agents at Plivo'", c: 'text-accent' }, { t: ',', c: 'text-fog' }],
  [{ t: '}', c: 'text-fog' }],
  [{ t: '$ ', c: 'text-fog' }, { t: 'open ./work', c: 'text-snow' }],
]

const Terminal = () => {
  const total = useMemo(() => LINES.reduce((n, l) => n + l.reduce((m, t) => m + t.t.length, 0), 0), [])
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const [count, setCount] = useState(reduced ? total : 0)
  useEffect(() => {
    if (count >= total) return
    const id = setInterval(() => setCount((c) => Math.min(c + 1, total)), 28)
    return () => clearInterval(id)
  }, [count >= total])
  const done = count >= total

  let used = 0
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/50">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-fog">stella@plivo — zsh</span>
      </div>
      <div className="min-h-[300px] p-5 font-mono text-[13px] leading-7 sm:text-sm" aria-label="Terminal introduction">
        {LINES.map((line, li) => {
          const lineLen = line.reduce((m, t) => m + t.t.length, 0)
          const start = used
          used += lineLen
          const visible = Math.max(0, Math.min(count - start, lineLen))
          if (visible === 0 && count < start) return null
          let seen = 0
          const spans = line.map((tok, ti) => {
            const s = seen
            seen += tok.t.length
            const cut = Math.max(0, Math.min(visible - s, tok.t.length))
            return cut > 0 ? <span key={ti} className={tok.c}>{tok.t.slice(0, cut)}</span> : null
          })
          const isLast = count >= start && count <= start + lineLen && !done
          const isOpenWork = li === LINES.length - 1
          const content = (
            <>
              {spans}
              {(isLast || (done && isOpenWork)) && <span className="caret" aria-hidden>▍</span>}
            </>
          )
          return (
            <div key={li} className="whitespace-pre">
              {isOpenWork && done ? (
                <a href="#work" className="rounded hover:bg-line/40">{content}</a>
              ) : content}
            </div>
          )
        })}
      </div>
    </figure>
  )
}

export const Cover = () => (
  <header id="top" className="dots border-b border-line">
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-12 lg:pt-24">
      <div className="lg:col-span-6">
        <p className="reveal font-mono text-xs uppercase tracking-[0.25em] text-accent">Software engineer · {profile.location}</p>
        <h1 className="reveal mt-5 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-snow sm:text-7xl">
          Stella<br />Sravanthi
        </h1>
        <p className="reveal mt-6 max-w-md text-lg leading-relaxed text-fog">{profile.specialty}</p>
        <div className="reveal mt-8 flex flex-wrap gap-5 text-sm">
          <a className="text-snow underline decoration-line underline-offset-4 hover:decoration-accent" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="text-snow underline decoration-line underline-offset-4 hover:decoration-accent" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="text-snow underline decoration-line underline-offset-4 hover:decoration-accent" href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
      <div className="reveal lg:col-span-6">
        <Terminal />
      </div>
    </div>

    <div className="mx-auto max-w-6xl px-6 pb-14">
      <dl className="reveal grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {profile.stats.map((s) => (
          <div key={s.label} className="bg-panel p-5">
            <dt className="font-display text-3xl font-semibold text-snow">{s.value}</dt>
            <dd className="mt-1 text-xs leading-snug text-fog">{s.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  </header>
)
