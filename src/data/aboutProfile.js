// Capability copy is grounded in the local Salt & Light and LifeCity sources.
export const aboutProfile = {
  name: 'Glenn Bernard Pimentel',
  intro: 'I build interfaces with a purpose, and the logic behind them.',
  bio: 'My React projects connect everyday routines to working software—from RPG-style personal growth to QR attendance and business workflows.',
  roles: ['Software engineer', 'UI / UX designer', 'NetSuite support'],
  skills: [
    { label: 'Interfaces', children: [
      { value: 'responsive', label: 'Responsive applications', detail: 'React and TypeScript interfaces with shared desktop and phone workflows.' },
      { value: 'mobile', label: 'Web to mobile', detail: 'Installable PWA experiences and Capacitor app shells for Android and iOS.' },
    ] },
    { label: 'Application logic', children: [
      { value: 'rules', label: 'Rules & progression', detail: 'XP, streak bonuses, equipment and unlocks that turn meaningful actions into character progression.' },
      { value: 'data', label: 'Safer data changes', detail: 'Permission-aware records, duplicate checks and conflict-aware Undo backed by Supabase.' },
    ] },
    { label: 'Design & support', children: [
      { value: 'uiux', label: 'UI / UX', detail: 'Clear action states, reusable components, responsive layouts and Figma prototypes.' },
      { value: 'erp', label: 'NetSuite support', detail: 'Troubleshooting, technical guidance and practical business workflows.' },
    ] },
  ],
  evidence: [
    {
      id: 'salt-light', label: 'Salt & Light', title: 'Growth, with a game system behind it.',
      details: ['XP, faith & passive bonuses', 'Devotion streaks & journals', 'PWA & native app wrappers'],
      source: ['salt-light/src/lib/gameData.js', 'salt-light/src/pages/DevotionPage.jsx', 'salt-light/README.md'],
    },
    {
      id: 'lifecity', label: 'LifeCity', title: 'A check-in is only the beginning.',
      details: ['QR check-in & duplicate checks', 'Conflict-aware record Undo', 'Role-scoped tools & audit history'],
      source: ['lifecity-attendance/src/components/AttendanceScanner.tsx', 'lifecity-attendance/src/lib/directoryActions.ts', 'lifecity-attendance/src/lib/memberStatusActions.ts', 'lifecity-attendance/README.md'],
    },
  ],
};
