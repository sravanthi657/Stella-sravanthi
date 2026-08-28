import { useEffect, useRef, useState, type ReactNode } from 'react'
import { caseStudies, code, experience, notes, profile, type CaseStudy } from './data'

const useReveal = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const Section = ({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) => (
  <section id={id} className="mx-auto max-w-5xl px-6 py-20">
    <div className="reveal">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-snow sm:text-4xl">{title}</h2>
    </div>
    <div className="mt-10">{children}</div>
  </section>
)

const Nav = () => (
  <nav className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-sm">
      <a href="#top" className="font-display font-semibold text-snow">SS</a>
      <div className="hidden gap-6 text-fog sm:flex">
        <a className="hover:text-snow" href="#work">Work</a>
        <a className="hover:text-snow" href="#notes">Notes</a>
        <a className="hover:text-snow" href="#experience">Experience</a>
        <a className="hover:text-snow" href="#code">Code</a>
      </div>
      <a href={profile.resume} className="rounded-md bg-accent px-3 py-1.5 font-medium text-ink hover:bg-accent-deep">
        Resume
      </a>
    </div>
  </nav>
)

const Hero = () => (
  <header id="top" className="glow">
    <div className="mx-auto max-w-5xl px-6 pb-16 pt-24 sm:pt-32">
      <p className="reveal font-mono text-sm text-accent">Software Engineer · {profile.location}</p>
      <h1 className="reveal mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-snow sm:text-6xl">
        {profile.name}
      </h1>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-fog">{profile.specialty}</p>
      <div className="reveal mt-8 flex flex-wrap gap-3 text-sm">
        <a href="#work" className="rounded-md bg-snow px-4 py-2 font-medium text-ink hover:bg-white">See the work</a>
        <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-md border border-line px-4 py-2 text-snow hover:border-fog">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-md border border-line px-4 py-2 text-snow hover:border-fog">LinkedIn</a>
        <a href={`mailto:${profile.email}`} className="rounded-md border border-line px-4 py-2 text-snow hover:border-fog">Email</a>
      </div>
      <dl className="reveal mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
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

const BrowserFrame = ({ src, alt }: { src: string; alt: string }) => (
  <figure className="overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/40">
    <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-3 h-4 flex-1 rounded bg-line/70" />
    </div>
    <img src={src} alt={alt} className="block w-full" loading="lazy" />
  </figure>
)

const Gallery = ({ study }: { study: CaseStudy }) => {
  const [i, setI] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = e.key === 'ArrowRight' ? (i + 1) % study.shots.length : (i - 1 + study.shots.length) % study.shots.length
    setI(next)
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }
  const shot = study.shots[i]
  return (
    <div>
      <BrowserFrame src={shot.src} alt={shot.caption} />
      <p className="mt-3 text-sm text-fog">{shot.caption}</p>
      {study.shots.length > 1 && (
        <div ref={tabsRef} role="tablist" aria-label={`${study.title} screenshots`} onKeyDown={onKey} className="mt-4 grid grid-cols-4 gap-2">
          {study.shots.map((s, idx) => (
            <button
              key={s.src}
              role="tab"
              aria-selected={idx === i}
              tabIndex={idx === i ? 0 : -1}
              onClick={() => setI(idx)}
              className={`overflow-hidden rounded-md border transition ${idx === i ? 'border-accent' : 'border-line opacity-60 hover:opacity-100'}`}
            >
              <img src={s.src} alt="" className="block w-full" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const Block = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{label}</h4>
    <div className="mt-2 text-[15px] leading-relaxed text-snow/90">{children}</div>
  </div>
)

const Study = ({ study, flip }: { study: CaseStudy; flip: boolean }) => (
  <article id={study.id} className="reveal border-t border-line py-16 first:border-t-0 first:pt-0">
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-fog">{study.eyebrow}</p>
    <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-snow sm:text-3xl">{study.title}</h3>
    <p className="mt-3 max-w-3xl text-lg text-fog">{study.summary}</p>
    <div className={`mt-10 grid gap-10 lg:grid-cols-5 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className="lg:col-span-3"><Gallery study={study} /></div>
      <div className="space-y-6 lg:col-span-2">
        <Block label="Problem">{study.problem}</Block>
        <Block label="My role">{study.role}</Block>
        <Block label="Result">{study.result}</Block>
        <div className="flex flex-wrap gap-2 pt-1">
          {study.stack.map((s) => (
            <span key={s} className="rounded-md border border-line px-2 py-0.5 text-xs text-fog">{s}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-10 grid gap-8 md:grid-cols-3">
      <Block label="Frontend decisions">
        <ul className="space-y-3">
          {study.decisions.map((d) => <li key={d} className="border-l-2 border-line pl-3">{d}</li>)}
        </ul>
      </Block>
      <Block label="Tradeoffs">
        <ul className="space-y-3">
          {study.tradeoffs.map((t) => <li key={t} className="border-l-2 border-line pl-3">{t}</li>)}
        </ul>
      </Block>
      <Block label="How it was verified">{study.quality}</Block>
    </div>
  </article>
)

const App = () => {
  useReveal()
  return (
    <>
      <Nav />
      <main className="font-sans antialiased">
        <Hero />

        <Section id="work" kicker="Selected work" title="Three things I built at Plivo">
          {caseStudies.map((s, idx) => <Study key={s.id} study={s} flip={idx % 2 === 1} />)}
          <p className="mt-6 text-xs text-fog/70">Screenshots come from a development environment with test data only.</p>
        </Section>

        <Section id="notes" kicker="Technical notes" title="Things I learned the hard way">
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((n) => (
              <div key={n.title} className="reveal rounded-xl border border-line bg-panel p-6">
                <h3 className="font-display text-lg font-semibold text-snow">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{n.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" kicker="Experience" title="Intern to SDE, one company, three roles">
          <ol className="relative border-l border-line">
            {experience.map((e) => (
              <li key={e.role} className="reveal ml-6 pb-10 last:pb-0">
                <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="font-mono text-xs text-fog">{e.period}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-snow">{e.role} · {e.org}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">{e.scope}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="code" kicker="Code" title="Things you can read">
          <div className="grid gap-4 sm:grid-cols-3">
            {code.map((c) => (
              <a key={c.name} href={c.href} target="_blank" rel="noreferrer" className="reveal group rounded-xl border border-line bg-panel p-5 transition hover:border-accent">
                <h3 className="font-mono text-sm font-semibold text-snow group-hover:text-accent">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{c.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tags.map((t) => <span key={t} className="rounded border border-line px-2 py-0.5 text-xs text-fog">{t}</span>)}
                </div>
              </a>
            ))}
          </div>
        </Section>

        <footer id="contact" className="border-t border-line">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Contact</p>
              <a href={`mailto:${profile.email}`} className="mt-2 block font-display text-2xl font-semibold text-snow hover:text-accent sm:text-3xl">{profile.email}</a>
            </div>
            <div className="flex gap-5 text-sm text-fog">
              <a className="hover:text-snow" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="hover:text-snow" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="hover:text-snow" href={profile.resume}>Resume</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

export default App
