export interface Shot { src: string; caption: string }
export interface Decision { title: string; body: string }
export interface Tradeoff { chose: string; over: string; why: string }

export interface CaseStudy {
  id: string
  eyebrow: string
  title: string
  summary: string
  problem: string
  role: string
  decisions: Decision[]
  tradeoffs: Tradeoff[]
  quality: string
  result: string
  stack: string[]
  shots: Shot[]
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'voice-agent',
    eyebrow: 'Case study 01',
    title: 'AI Voice Agent Platform',
    summary: 'A no-code builder and studio where customers design an AI phone agent, configure its voice, and test it by talking to it in the browser.',
    problem:
      'Businesses wanted AI agents on their phone lines without hiring ML engineers. The hard part was not the LLM. It was giving non-engineers a way to shape a conversation, tune speech, and trust the result before going live.',
    role:
      'Frontend engineer on a small pod. I built the agent configuration surfaces (voice, transcription, interruption handling, callback auth) and the live testing playground end to end, and shipped fixes across the flow builder the studio sits on.',
    decisions: [
      { title: 'Config-driven forms', body: 'Every settings tab is field config (Zod rule, visibility predicate, cross-field reactions) rendered by one generic form layer. A new setting is data, not a component.' },
      { title: 'One payload, three forms', body: 'Three independently mounted forms write one backend object. The save path field-picks each form\'s slice, so an unvisited tab can never clobber another tab\'s edits.' },
      { title: 'Resumable SSE streaming', body: 'Hand-rolled on fetch and ReadableStream because EventSource cannot send auth headers. Backoff reconnect resumes via Last-Event-ID, so a refresh keeps the transcript.' },
      { title: 'Run-keyed transcript reducer', body: 'Execution history is keyed by run id, not node id: loops execute the same node twice and chunks can arrive before their parent event.' },
      { title: 'Fail-closed NAT probe', body: 'A throwaway RTCPeerConnection against STUN, 2 second timeout. A symmetric NAT gets a clear "your network blocks voice" popover instead of a silent dead call.' },
    ],
    tradeoffs: [
      { chose: 'WebRTC through real telephony', over: 'a call simulator', why: 'A test that passes on a fake and fails in production is worse than no test.' },
      { chose: 'SSE', over: 'WebSocket', why: 'The feed is one-directional and needs resumability. User messages go over plain POSTs.' },
    ],
    quality: 'Stream and reducer logic live in pure functions with unit tests; UI behaviour is tested on real stores, not mocked modules.',
    result:
      'The playground is the moment customers validate an agent before launch. NAT detection turned a class of "it does not work" tickets into a self-service message.',
    stack: ['React', 'TypeScript', 'TanStack Form', 'Zod', 'SSE', 'WebRTC', 'React Flow', 'OpenAI API'],
    shots: [
      { src: 'shots/voice-config-tab.png', caption: 'Voice configuration: TTS model tradeoff, speed, pronunciation' },
      { src: 'shots/node-config-sidebar.png', caption: 'Per-node configuration rendered from field config' },
    ],
  },
  {
    id: 'console-migration',
    eyebrow: 'Case study 02',
    title: 'Legacy Console Migration',
    summary: 'Rebuilding the classic Plivo console modules inside the new CX platform so legacy customers could move over.',
    problem:
      'Customers managed phone numbers, SIP trunks, and billing in an older console. Every module had to reach feature parity in the new React platform before accounts could be migrated, and each one hid its own edge cases.',
    role:
      'I rebuilt phone numbers (search, buy, port-in wizard), SIP trunking, billing and invoices, and pricing end to end, and owned the production issues that surfaced as customers moved.',
    decisions: [
      { title: 'Platform-aware trunk config', body: 'LiveKit, Retell, Vapi, ElevenLabs and xAI each get their own URI template, transports and managed IP allow-list from one pure config module. Invalid combinations cannot be offered.' },
      { title: 'Region drives configuration', body: 'ElevenLabs resolves to its India residency host for India accounts, and platforms without India servers are not offered there.' },
      { title: 'Pagination as a contract', body: 'Pagers key off hasNext, never total_count, after finding APIs that return zero for it. Selects resolve out-of-page values explicitly.' },
      { title: 'Wizard blocker summary', body: 'A multi-step form whose submit lives on step three can fail silently on a step one field, so the port-in wizard surfaces a form-level blocker summary.' },
    ],
    tradeoffs: [
      { chose: 'Recording the platform server-side', over: 'inferring it from URI shape', why: 'Inference could not distinguish two platforms even in principle and would produce a UI that lies.' },
      { chose: 'Grandfathering plan gates', over: 'gating every account at once', why: 'Taking a screen away from an existing account is a breaking change. Gates key off org creation date and fail open.' },
    ],
    quality: 'Pure config and payload builders are unit tested and mutation checked; lists are verified against real page counts.',
    result:
      'Legacy customers now live on the new console. Along the way a P1 memory incident traced to an unpaginated dropdown fetching 2,752 records was fixed with server-side PostgreSQL search, and invoices hidden by a missing pager became reachable again.',
    stack: ['React', 'TypeScript', 'TanStack Query', 'Zod', 'PostgreSQL', 'Go gateway'],
    shots: [
      { src: 'shots/create-trunk-platforms.png', caption: 'Platform-aware SIP trunk creation' },
      { src: 'shots/numbers-list.png', caption: 'Phone numbers management' },
      { src: 'shots/invoices.png', caption: 'Invoices, with the pagination that was missing' },
      { src: 'shots/usage-overview.png', caption: 'Usage and spend overview' },
    ],
  },
  {
    id: 'whatsapp',
    eyebrow: 'Case study 03',
    title: 'WhatsApp Business Integration',
    summary: 'Onboarding WhatsApp numbers through Meta Embedded Signup, across the React console and the Python services behind it.',
    problem:
      'Connecting a number spans four systems (console, our backend, the WhatsApp messaging service, Meta) with no shared transaction. Any step can fail, and Meta\'s popup gives the same empty answer for "user closed it" and "auth failed".',
    role:
      'I own this module: the onboarding wizard, number sync and disconnect, WABA to account mapping, and template management on the frontend, plus the orchestration endpoints in the Flask backend. Around 40 merged PRs across both.',
    decisions: [
      { title: 'Selective rollback', body: 'If webhook registration fails, the just-created number row is deleted so retry starts clean. An application created in the same call is removed; a pre-existing one is never touched.' },
      { title: 'Reconciliation over trust', body: 'Numbers registered inside Meta\'s popup sometimes never call back, so the numbers screen syncs on mount and offers a manual sync.' },
      { title: 'Typed template payloads', body: 'Authentication templates with one-tap and zero-tap OTP buttons, and dynamic URL buttons that append the variable exactly the way Meta validates it.' },
      { title: 'Actionable error mapping', body: 'Errors crossing three hops are classified into messages a user can act on ("account already onboarded") instead of a generic failure.' },
    ],
    tradeoffs: [
      { chose: 'A stateless backend for WhatsApp state', over: 'mirroring Meta state in our DB', why: 'A mirror would guarantee drift; we only add account context.' },
      { chose: 'Explicit cache invalidation, 2s timeout', over: 'waiting out a 24h routing TTL', why: 'The save path can call it four times; a default timeout would stall the user.' },
    ],
    quality: 'Backend orchestration has unit tests for auth resolution and cache invalidation; template form logic is covered per category branch.',
    result:
      'This flow gates WhatsApp for enterprise customers. The rollback and sync work converted several "stuck forever" onboarding states into retryable ones.',
    stack: ['React', 'TypeScript', 'Python', 'Flask', 'Meta Cloud API'],
    shots: [
      { src: 'shots/wa-numbers.png', caption: 'WhatsApp numbers with connection and quality status' },
      { src: 'shots/wa-templates-list.png', caption: 'Message template management' },
    ],
  },
]

export const notes = [
  {
    title: 'Resumable SSE without EventSource',
    body: 'EventSource cannot send auth headers, so the playground stream is fetch plus ReadableStream with manual frame parsing. Last-Event-ID maps to a Redis Streams offset server-side. The subtle bug: replayed history arrives oldest first, so first-wins pinned the UI to a finished run. Latest-wins on replay, first-wins live.',
  },
  {
    title: 'Fail closed on network probes',
    body: 'If the NAT probe times out, the UI warns instead of pretending the network is fine. A false "ok" produces a dead call and a support ticket; a false warning produces a retry button.',
  },
  {
    title: 'Pagination is a contract',
    body: 'Three separate production bugs came from lists fetching everything or from pagers gated on a total the API returned as zero. The rule now: real page size, gate on hasNext, and resolve out-of-page selected values explicitly.',
  },
  {
    title: 'Derived ports must clean up their edges',
    body: 'In the flow builder a node\'s output handles are computed from its config. Rename a branch condition and an edge can point at a handle that no longer exists, so deleting an edge reaches back into the node config that produced it.',
  },
]

export const experience = [
  {
    role: 'Software Development Engineer',
    org: 'Plivo',
    period: 'Jul 2024 to present',
    scope: 'Frontend for the CX console (React, TypeScript), Python services behind it, contributions to the Go API gateway. Own the WhatsApp module. Voice agent studio, console migration, design system.',
  },
  {
    role: 'Software Development Engineer in Test',
    org: 'Plivo',
    period: 'Jun 2023 to Jul 2024',
    scope: 'Selenium and REST API automation for Sellular, release validation suites. A year of watching frontends break in production shaped how I write them now.',
  },
  {
    role: 'Software Engineer Intern',
    org: 'Plivo',
    period: 'Jun 2022 to Aug 2022',
    scope: 'Python unit tests for Flask services.',
  },
]

export const code = [
  {
    name: 'langgraph-support-agent',
    desc: 'A LangGraph tool-calling agent with checkpointed memory and an offline fake model so the graph is testable without API keys.',
    href: 'https://github.com/sravanthi657',
    tags: ['Python', 'LangGraph'],
  },
  {
    name: 'job-listing-platform',
    desc: 'MERN job portal: JWT auth, search and filtering, REST APIs over MongoDB.',
    href: 'https://github.com/sravanthi657',
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    name: 'this site',
    desc: 'Vite, React, TypeScript, Tailwind. Scroll reveal respects reduced motion; galleries are keyboard tab lists.',
    href: 'https://github.com/sravanthi657/Stella-sravanthi',
    tags: ['React', 'Tailwind'],
  },
]

export const profile = {
  name: 'Stella Sravanthi',
  headline: 'Stella Sravanthi',
  specialty: 'I build communication products at Plivo: React, TypeScript, design systems, and data-heavy product UI, with Python, Go, PostgreSQL, and AWS behind them.',
  location: 'Bengaluru, India',
  email: 'stellasravanthidevarakonda@gmail.com',
  github: 'https://github.com/sravanthi657',
  linkedin: 'https://www.linkedin.com/in/stella-sravanthi-devarakonda',
  resume: 'Stella_Sravanthi_Resume.pdf',
  stats: [
    { value: '3+', label: 'years at Plivo, intern to SDE' },
    { value: '50+', label: 'design system components built or maintained' },
    { value: '200+', label: 'merged PRs across five services' },
    { value: '40+', label: 'PRs on the WhatsApp module alone' },
  ],
}
