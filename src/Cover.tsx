import { useEffect, useRef } from 'react'
import { profile } from './data'

const NAV = [
  ['home', '#top'],
  ['work', '#work'],
  ['notes', '#notes'],
  ['experience', '#experience'],
  ['contact', '#contact'],
] as const

export const Nav = () => (
  <nav className="absolute inset-x-0 top-0 z-40">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 font-mono text-sm">
      <a href="#top" className="text-accent">
        StellaSravanthi.<span className="cursor text-violet-400">_</span>
      </a>
      <div className="hidden gap-7 text-snow/80 md:flex">
        {NAV.map(([label, href], i) => (
          <a key={label} href={href} className="group relative hover:text-snow">
            <span className="absolute -top-3 left-4 text-[9px] text-fog">0{i + 1}</span>
            <span className="text-fog">// </span>{label}
          </a>
        ))}
      </div>
      <a href={profile.resume} className="rounded border border-accent/50 px-3 py-1 text-accent hover:bg-accent hover:text-ink">
        resume
      </a>
    </div>
  </nav>
)

const Cube = ({ size, className }: { size: number; className: string }) => {
  const s = `${size}px`
  const half = `${size / 2}px`
  const faces = [
    `rotateY(0deg) translateZ(${half})`,
    `rotateY(90deg) translateZ(${half})`,
    `rotateY(180deg) translateZ(${half})`,
    `rotateY(-90deg) translateZ(${half})`,
    `rotateX(90deg) translateZ(${half})`,
    `rotateX(-90deg) translateZ(${half})`,
  ]
  return (
    <div className={`cube ${className}`} style={{ width: s, height: s }}>
      {faces.map((t) => (
        <div key={t} className="cube-face" style={{ transform: t }} />
      ))}
    </div>
  )
}

export const Cover = () => {
  const scene = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24
      const y = (e.clientY / window.innerHeight - 0.5) * 24
      scene.current?.style.setProperty('transform', `translate(${x}px, ${y}px)`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <header id="top" className="cover relative flex min-h-screen items-center justify-center overflow-hidden">
      <Nav />
      <div ref={scene} className="scene pointer-events-none absolute inset-0 transition-transform duration-700 ease-out" aria-hidden>
        <div className="orb" />
        <Cube size={170} className="cube-a" />
        <Cube size={120} className="cube-b" />
        <Cube size={90} className="cube-c" />
        <span className="ring-dot" />
      </div>
      <div className="relative z-10 px-6 text-center">
        <h1 className="font-display text-[13vw] font-bold uppercase leading-none tracking-[0.04em] text-white drop-shadow-[0_8px_40px_rgba(0,0,0,.6)] sm:text-[9vw]">
          {profile.name}
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.35em] text-snow/85 sm:text-sm">
          Software engineer · React, TypeScript &amp; Python.
        </p>
      </div>
      <a href="#work" className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-fog hover:text-snow">
        scroll
      </a>
    </header>
  )
}
