export interface Shot { src: string; caption: string }

export interface CaseStudy {
  id: string
  eyebrow: string
  title: string
  summary: string
  problem: string
  role: string
  decisions: string[]
  tradeoffs: string[]
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
      'Config-driven forms: every settings tab is declared as field config (Zod rule, visibility predicate, cross-field reactions) rendered by one generic form layer, so a new setting is data, not a new component.',
      'Three independently mounted forms write one backend payload. The save path field-picks each form\'s slice so an unvisited tab can never clobber another tab\'s edits with defaults.',
      'Playground events stream over Server-Sent Events, hand-rolled on fetch and ReadableStream because EventSource cannot send auth headers. Reconnect uses exponential backoff and resumes via Last-Event-ID, so a refresh keeps the transcript.',
      'The transcript reducer keys execution history by run id, not node id, because loops execute the same node twice and chunks can arrive before their parent event.',
      'NAT detection before a test call: a throwaway RTCPeerConnection against a STUN server, 2 second timeout, fail closed. A symmetric NAT gets a clear "your network blocks voice" popover instead of a silent dead call.',
    ],
    tradeoffs: [
      'WebRTC through the real telephony path instead of a simulator: heavier to build, but a test that passes on a fake and fails in production is worse than no test.',
      'SSE over WebSocket: the feed is one-directional and needs resumability. Messages the user sends go over plain POSTs.',
    ],
    quality:
      'Reducer and stream logic live in pure functions with unit tests (out-of-order chunks, replayed run announcements, resume offsets). UI behaviour is covered with component tests on the real stores rather than mocked modules.',
    result:
      'The playground is the moment customers validate an agent before launch. NAT detection turned a class of "it does not work" tickets into a self-service message.',
    stack: ['React', 'TypeScript', 'TanStack Form', 'Zod', 'SSE', 'WebRTC', 'React Flow', 'OpenAI API'],
    shots: [
      { src: '/shots/voice-config-tab.png', caption: 'Voice configuration: TTS model tradeoff, speed, pronunciation' },
      { src: '/shots/node-config-sidebar.png', caption: 'Per-node configuration rendered from field config' },
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
      'SIP trunk creation is platform-aware: LiveKit, Retell, Vapi, ElevenLabs, and xAI each get their own URI template, transport rules, and managed IP allow-list from one pure config module, so the form cannot offer an invalid combination.',
      'Region drives configuration, not the user: ElevenLabs resolves to its India residency host for India accounts, and platforms without India servers are not offered there.',
      'Pagination is treated as a contract, not an optimisation. Pagers key off hasNext, never total_count, after finding APIs that return zero for it.',
      'The port-in wizard surfaces a form-level blocker summary, because a multi-step form whose submit button lives on step three can otherwise fail silently on a step one field.',
    ],
    tradeoffs: [
      'Recording the chosen SIP platform server-side instead of inferring it from URI shape: one more API, but inference could not distinguish two platforms even in principle and would have produced a UI that lies.',
      'Grandfathering plan gates to new signups only. Taking a screen away from an existing account is a breaking change, so gates key off org creation date and fail open on missing data.',
    ],
    quality:
      'Pure config and payload builders are unit tested and mutation checked. Every list and select is verified against real page counts, and UI changes ship with screenshots in the PR.',
    result:
      'Legacy customers now live on the new console. Along the way a P1 memory incident traced to an unpaginated dropdown fetching 2,752 records was fixed with server-side PostgreSQL search, and invoices hidden by a missing pager became reachable again.',
    stack: ['React', 'TypeScript', 'TanStack Query', 'Zod', 'PostgreSQL', 'Go gateway'],
    shots: [
      { src: '/shots/create-trunk-platforms.png', caption: 'Platform-aware SIP trunk creation' },
      { src: '/shots/numbers-list.png', caption: 'Phone numbers management' },
      { src: '/shots/invoices.png', caption: 'Invoices, with the pagination that was missing' },
      { src: '/shots/usage-overview.png', caption: 'Usage and spend overview' },
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
      'Registration with selective rollback: if webhook registration fails the just-created number row is deleted so a retry starts clean, and a Plivo application created in the same call is removed, but a pre-existing one is never touched.',
      'Reconciliation over trust: numbers registered inside Meta\'s popup sometimes never call back, so the numbers screen syncs on mount and offers a manual sync.',
      'Template payloads are built client-side from a typed form: authentication templates with one-tap and zero-tap OTP buttons, and dynamic URL buttons that append the variable exactly the way Meta validates it.',
      'Errors crossing three hops are classified into actionable messages ("account already onboarded") instead of a generic failure.',
    ],
    tradeoffs: [
      'The backend stays stateless for WhatsApp state. Duplicating Meta state in our database would guarantee drift, so we only add account context.',
      'A downstream routing cache was invalidated explicitly on config change, with a 2 second timeout, because the save path can call it four times and a default timeout would stall the user.',
    ],
    quality:
      'Backend orchestration has unit tests for the subaccount auth resolution and cache invalidation paths. Frontend template form logic is covered by config tests for every category branch.',
    result:
      'This flow gates WhatsApp for enterprise customers. The rollback and sync work converted several "stuck forever" onboarding states into retryable ones.',
    stack: ['React', 'TypeScript', 'Python', 'Flask', 'Meta Cloud API'],
    shots: [
      { src: '/shots/wa-numbers.png', caption: 'WhatsApp numbers with connection and quality status' },
      { src: '/shots/wa-templates-list.png', caption: 'Message template management' },
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
    desc: 'Vite, React, TypeScript, Tailwind. Scroll reveal respects reduced motion; thumbnails are keyboard tabs.',
    href: 'https://github.com/sravanthi657',
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
  resume: '/Stella_Sravanthi_Resume.pdf',
  stats: [
    { value: '3+', label: 'years at Plivo, intern to SDE' },
    { value: '50+', label: 'design system components built or maintained' },
    { value: '200+', label: 'merged PRs across five services' },
    { value: '40+', label: 'PRs on the WhatsApp module alone' },
  ],
}
