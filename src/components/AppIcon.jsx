const paths = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  applications: <><rect x="3" y="7" width="18" height="14" rx="3" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v3h4v-3" /></>,
  statistics: <><path d="M4 20h16M6 16v-5M12 16V5M18 16V8" /></>,
  offers: <><circle cx="12" cy="9" r="6" /><path d="m8 14-1 7 5-3 5 3-1-7m-7-12 1 2 2 .3-1.5 1.5.4 2.2-1.9-1-1.9 1 .4-2.2L7 7.3l2-.3" /></>,
}

export default function AppIcon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.overview}</svg>
}
