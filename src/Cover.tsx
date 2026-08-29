import { useEffect, useState } from 'react'
import { caseStudies, profile } from './data'

const FEATURED = [
  { study: caseStudies[1], shot: caseStudies[1].shots[0] }, // SIP trunk platforms
  { study: caseStudies[2], shot: caseStudies[2].shots[0] }, // WhatsApp numbers
  { study: caseStudies[1], shot: caseStudies[1].shots[2] }, // Invoices
]

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

const Frame = ({ children }: { children: React.ReactNode }) => (
  <figure className="overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/50">
    <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-3 h-4 flex-1 rounded bg-line/70" />
    </div>
    {children}
  </figure>
)

export const Cover = () => {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % FEATURED.length), 5000)
    return () => clearInterval(t)
  }, [paused])
  const current = FEATURED[i]

  return (
    <header id="top" className="dots border-b border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-5">
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

        <div className="reveal lg:col-span-7" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <Frame>
            <div className="relative aspect-[16/10]">
              {FEATURED.map((f, idx) => (
                <img
                  key={f.shot.src}
                  src={f.shot.src}
                  alt={f.shot.caption}
                  className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'opacity-0'}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </Frame>
          <div className="mt-4 flex items-center justify-between gap-4">
            <a href={`#${current.study.id}`} className="group text-sm">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{current.study.eyebrow}</span>
              <span className="ml-3 text-snow group-hover:underline">{current.shot.caption} →</span>
            </a>
            <div className="flex gap-1.5" role="tablist" aria-label="Featured screenshots">
              {FEATURED.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`Show screenshot ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-accent' : 'w-1.5 bg-line hover:bg-fog'}`}
                />
              ))}
            </div>
          </div>
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
}
