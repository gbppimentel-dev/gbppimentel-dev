// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R8 | Actual Salt & Light screens and feature chapters
// These are supplied app captures. Visible account progress is example app state,
// not project usage, performance, or success metrics.
const imageRoot = 'images/projects/salt-light-r2/';

export const saltShowcaseScreens = [
  {
    id: 'welcome', label: 'Welcome', src: imageRoot + 'welcome.png',
    alt: 'Salt & Light desktop welcome screen with a green introduction and Google sign-in card.',
    caption: 'The desktop welcome: a calm introduction, Google sign-in, and a clear next step.',
    group: 'welcome', layout: 'desktop', width: 1182, height: 691,
  },
  {
    id: 'onboarding', label: 'A quick introduction', src: imageRoot + 'onboarding.png',
    alt: 'Salt & Light onboarding step explaining goals, XP, Faith, levels, equipment, and skills.',
    caption: 'A short guided tour introduces how daily actions connect to character growth.',
    group: 'welcome', layout: 'panel', width: 475, height: 353,
  },
  {
    id: 'devotion-tour', label: 'Devotion, explained', src: imageRoot + 'devotion-tour.png',
    alt: 'Salt & Light guided-tour card describing the devotion journal and streak bonuses.',
    caption: 'The devotion tour explains reflection, consistency, and the rewards along the way.',
    group: 'devotion', layout: 'panel', width: 466, height: 367,
  },
  {
    id: 'devotion', label: 'Daily devotion', src: imageRoot + 'devotion.png',
    alt: 'Salt & Light mobile devotion view with Bible passage selectors, a passage preview, and XP and Faith rewards.',
    caption: 'The mobile devotion view: select a passage, preview the text, and begin a reflection.',
    group: 'devotion', layout: 'phone', width: 573, height: 717,
  },
  {
    id: 'devotion-calendar', label: 'A month of reflection', src: imageRoot + 'devotion-calendar.png',
    alt: 'Salt & Light monthly devotion calendar with completed days and the mobile navigation bar.',
    caption: 'A monthly calendar makes past entries easy to revisit, with completed days clearly marked.',
    group: 'devotion', layout: 'phone', width: 408, height: 549,
  },
  {
    id: 'goals', label: 'Goals & quests', src: imageRoot + 'goals.png',
    alt: 'Salt & Light mobile Goals screen with Daily, Weekly, Elite, and Boss tabs, a calendar, task archive, and bottom navigation.',
    caption: 'Goals on mobile: quest types, dates, an archive, and the main navigation in one compact screen.',
    group: 'mobile', layout: 'phone', width: 407, height: 840,
  },
  {
    id: 'achievements', label: 'Milestones & bonuses', src: imageRoot + 'achievements.png',
    alt: 'Salt & Light achievement progress and a list of active skill bonuses.',
    caption: 'Achievement progress and active skill bonuses bring longer-term milestones into view.',
    group: 'character', layout: 'panel', width: 405, height: 321,
  },
  {
    id: 'feedback', label: 'Feedback & bug reports', src: imageRoot + 'feedback.png',
    alt: 'Salt & Light mobile feedback form with category, subject, message, and a green send button.',
    caption: 'A dedicated mobile form gives people a place to report an issue or share an idea.',
    group: 'mobile', layout: 'phone', width: 446, height: 835,
  },
  {
    id: 'dashboard', label: 'Your daily overview', src: imageRoot + 'dashboard.png',
    alt: 'Salt & Light mobile dashboard crop showing level progress, goal summaries, today’s goals, and recent activity.',
    caption: 'The mobile dashboard brings character progress, today’s goals, and recent activity together.',
    group: 'mobile', layout: 'phone', width: 443, height: 682,
  },
  {
    id: 'equipment', label: 'Equipment shop', src: imageRoot + 'equipment.png',
    alt: 'Salt & Light equipment shop with pastel item cards, equipment categories, bonuses, and class requirements.',
    caption: 'Equipment adds another layer to progression: item types, useful bonuses, and job requirements.',
    group: 'character', layout: 'desktop', width: 882, height: 586,
  },
  {
    id: 'jobs', label: 'Choose a job path', src: imageRoot + 'jobs.png',
    alt: 'Salt & Light tiered job tree with Seeker, Warrior, Scholar, Devotee, Knight, and Berserker paths.',
    caption: 'The job tree makes level gates, prerequisites, and each path’s bonuses visible before a change.',
    group: 'character', layout: 'desktop', width: 1025, height: 880,
  },
  {
    id: 'skills', label: 'Build your skill set', src: imageRoot + 'skills.png',
    alt: 'Salt & Light skill tree with job filters, available skill points, unlocked abilities, and their bonuses.',
    caption: 'Skills connect character choices to everyday progress, with unlocked abilities gathered below.',
    group: 'character', layout: 'desktop', width: 1008, height: 456,
  },

  {
    "id": "achievement-collection",
    "label": "Achievement Collection",
    "src": "images/projects/salt-light-r6/achievement-collection.png",
    "alt": "Salt & Light mobile achievement collection with search, category filters, unlocked milestones, and progress bars.",
    "caption": "Search achievements, filter by category, and see each milestone’s unlock state and progress.",
    "group": "character",
    "layout": "phone",
    "width": 494,
    "height": 892
  },
  {
    "id": "welcome-mobile",
    "label": "Mobile Welcome",
    "src": "images/projects/salt-light-r6/welcome-mobile.png",
    "alt": "Salt & Light mobile welcome screen with a green introduction stacked above its Google sign-in card.",
    "caption": "The mobile welcome keeps the introduction and Google sign-in in a single-column layout.",
    "group": "welcome",
    "layout": "phone",
    "width": 511,
    "height": 939
  },
];

export const saltFeatureChapters = [
  {
    "id": "overview",
    "label": "Overview",
    "icon": "screen",
    "tone": "mint",
    "title": "A Clear Place to Begin.",
    "emphasis": "Begin.",
    "description": "The dashboard brings today’s priorities and longer-term progress together. Check your character’s level, see the goals ahead, and review recent activity before choosing the next action in your day.",
    "screenIds": [
      "dashboard"
    ],
    "highlights": [
      "Character level and XP progress",
      "Active goals, completed goals, and today’s completions",
      "Today’s priorities and recent reward activity"
    ],
    "closingLine": "See where you are, then decide what comes next."
  },
  {
    "id": "quests",
    "label": "Quests",
    "icon": "target",
    "tone": "gold",
    "title": "Give Everyday Goals a Little Adventure.",
    "emphasis": "Adventure.",
    "description": "Turn intentions into clear, manageable quests. Daily and Weekly goals support everyday plans, while Elite and Boss Fight categories make room for longer commitments and bigger personal challenges. Finished tasks contribute to character growth.",
    "screenIds": [
      "goals"
    ],
    "highlights": [
      "Daily, Weekly, Elite & Boss Fight goals",
      "Dates, calendar views, editing, and a task archive",
      "Copy daily goals to chosen dates or weekly goals to another date",
      "Complete goals to earn XP, with character bonuses where applicable"
    ],
    "closingLine": "A finished task becomes another step in your character’s journey."
  },
  {
    "id": "devotion",
    "label": "Devotion",
    "icon": "book",
    "tone": "gold",
    "title": "Make Room for the Word—and Your Response.",
    "emphasis": "Your Response.",
    "description": "Select a book, chapter, verses, and translation to automatically load the matching Bible passage beside your reflection. Save the entry, revisit it in the monthly calendar, and earn rewards shaped by streaks and character bonuses.",
    "screenIds": [
      "devotion",
      "devotion-calendar"
    ],
    "highlights": [
      "Automatic Bible passage preview in your selected translation",
      "Write reflections and edit the current day’s entry",
      "Revisit past entries through the monthly calendar",
      "Devotion streaks, XP and Faith rewards, and PNG exports"
    ],
    "closingLine": "Keep a record of what you read and what you want to carry into daily life."
  },
  {
    "id": "character",
    "label": "Character",
    "icon": "layers",
    "tone": "lilac",
    "title": "Build a Character with a Story behind It.",
    "emphasis": "Story",
    "description": "Completed goals and devotion feed a character with levels, resources, and choices of its own. Job paths, equipment, and unlocked skills connect individual actions to an ongoing progression system, with requirements visible before each decision.",
    "screenIds": [
      "equipment",
      "jobs",
      "skills"
    ],
    "highlights": [
      "Level and XP progress, Faith, and Skill Points",
      "Job choices, equipped items, and active abilities",
      "Achievement progress and an exportable profile card"
    ],
    "closingLine": "Progress opens choices, and those choices influence the next steps.",
    "views": {
      "equipment": {
        "title": "Give Your Progress Something to Equip.",
        "emphasis": "Equip.",
        "description": "Browse equipment by tier, requirements, costs, and bonuses. Free items become available when their requirements are met; other items use earned XP, Faith, or both. Equip a combination that suits your character.",
        "highlights": [
          "Visible costs, bonuses, and job requirements",
          "Clear owned, locked, and equipped states",
          "Up to six equipped items, with equip and unequip controls"
        ],
        "closingLine": "Earn resources, compare the choices, then make them part of your build."
      },
      "jobs": {
        "title": "Choose the Path You Want to Grow Into.",
        "emphasis": "Grow Into.",
        "description": "Begin as a Seeker and explore paths such as Warrior, Scholar, and Devotee. A tiered job tree makes level gates, prerequisite paths, and each job’s bonuses visible before you make a change.",
        "highlights": [
          "A tiered tree of character job paths",
          "Visible level gates and prerequisite jobs",
          "Job-specific bonuses and a record of reached jobs"
        ],
        "closingLine": "Choose a direction with a clear view of what it unlocks."
      },
      "skills": {
        "title": "Unlock Abilities That Shape Everyday Rewards.",
        "emphasis": "Everyday Rewards.",
        "description": "Spend Skill Points on abilities associated with available job paths. Skills can add bonuses to goal completion, on-time actions, and devotion. Unlocked skills remain part of your character when you change jobs.",
        "highlights": [
          "Skills grouped by job path with visible point costs",
          "Clear locked and unlocked states",
          "An active-abilities summary and skill carryover between jobs"
        ],
        "closingLine": "Build on the abilities you have already earned."
      }
    }
  },
  {
    "id": "milestones",
    "label": "Milestones",
    "icon": "shield",
    "tone": "rose",
    "title": "Recognize the Milestones along the Way.",
    "emphasis": "Milestones",
    "description": "Achievements bring progress from across the app into one collection. Explore milestones for goals, levels, devotion, Faith, equipment, skills, and job progression, with unfinished achievements showing what remains before the next unlock.",
    "screenIds": [
      "achievements",
      "achievement-collection"
    ],
    "highlights": [
      "Searchable achievement collection",
      "Categories, rarity labels, and locked or unlocked states",
      "Progress toward unfinished milestones and overall completion"
    ],
    "closingLine": "See what you have accomplished—and what you might work toward next."
  },
  {
    "id": "connections",
    "label": "Connections",
    "icon": "users",
    "tone": "mint",
    "title": "A Personal Journey, with Room for Others.",
    "emphasis": "Room for Others.",
    "description": "Find another character through a public ID and preview their profile before sending a friend request. Incoming and outgoing requests, accepted friends, and Mail keep the different stages of a connection easy to follow.",
    "screenIds": [
      "onboarding"
    ],
    "highlights": [
      "Copy your public ID and search for another character",
      "Preview a character’s job, level, and equipment count",
      "Accept or decline requests and manage accepted friends"
    ],
    "closingLine": "Keep your own journey while staying connected to other characters."
  },
  {
    "id": "feedback",
    "label": "Feedback",
    "icon": "message",
    "tone": "gold",
    "title": "Feedback & Bug Reports.",
    "emphasis": "Feedback",
    "description": "A dedicated feedback form keeps a category, subject, and message together. Report a bug, suggest an improvement, or explain what you need through a compact layout that fits the mobile experience.",
    "screenIds": [
      "feedback"
    ],
    "highlights": [
      "Bug reports, suggestions, and feature ideas",
      "Category, subject, and message fields",
      "A compact form suited to the mobile layout"
    ],
    "closingLine": "A clear place to share the next improvement."
  },
  {
    "id": "everywhere",
    "label": "Web & Mobile",
    "icon": "phone",
    "tone": "lilac",
    "title": "From Your Browser to Your Home Screen.",
    "emphasis": "Home Screen.",
    "description": "Salt & Light adapts from a desktop workspace to a compact phone layout. Bottom navigation keeps the main workspaces within reach, while home-screen installation provides a standalone web-app experience on Android and iOS.",
    "screenIds": [
      "welcome",
      "welcome-mobile"
    ],
    "highlights": [
      "Responsive desktop, tablet, and phone layouts",
      "Mobile access to Dashboard, Goals, Devotion, Mail, and Character",
      "Installable web app on Android and iOS",
      "Google sign-in and saved account progress"
    ],
    "closingLine": "The same connected journey, on the screen you have with you."
  }
];

// Implementation stories verified against the Salt & Light application source.
export const saltBuildStories = [
  {
    "id": "shared-progression",
    "icon": "bolt",
    "tone": "gold",
    "title": "One Reward Engine. Different Character Choices.",
    "summary": "Goals and devotion call shared reward calculations. Each activity’s base reward is combined with the current job, equipped items, and unlocked skills, with on-time completion and devotion streaks contributing where relevant.",
    "steps": [
      "Complete an activity",
      "Apply character bonuses",
      "Record progress"
    ],
    "tools": [
      {
        "technology": "javascript",
        "role": "Shared XP and Faith functions apply job bonuses, item passives, and skill modifiers to completed actions."
      },
      {
        "technology": "react",
        "role": "The character hook connects reward results to level progress, Skill Points, equipment, and active abilities."
      },
      {
        "technology": "date-fns",
        "role": "Date comparisons identify on-time goals, while devotion dates determine the current streak."
      }
    ],
    "detail": "Goal completion awards XP; Faith bonuses depend on character choices. Devotion has its own XP and Faith rewards."
  },
  {
    "id": "optimistic-goals",
    "icon": "target",
    "tone": "mint",
    "title": "Immediate Feedback, with a Way Back.",
    "summary": "Creating, completing, or deleting a goal updates the visible list before the request finishes. The previous cache is retained for rollback, and successful changes refresh the related goal and activity records.",
    "steps": [
      "Update the visible list",
      "Save the change",
      "Refresh or roll back"
    ],
    "tools": [
      {
        "technology": "react-query",
        "role": "Goal mutations snapshot cached lists, apply optimistic changes, restore the snapshot on failure, and invalidate affected queries after success."
      },
      {
        "technology": "framer-motion",
        "role": "Animated goal forms and list transitions soften the interface changes around planning and completion."
      }
    ],
    "detail": "The dashboard uses the same cache-first completion pattern so finishing a goal feels consistent across both workspaces."
  },
  {
    "id": "personal-records",
    "icon": "users",
    "tone": "lilac",
    "title": "Personal Records, Connected Requests.",
    "summary": "Supabase restores the signed-in session and handles Google sign-in. Goals, devotion, and character records carry user identity, while friend requests share refresh signals so Mail and the navigation badge stay aligned.",
    "steps": [
      "Restore the session",
      "Load personal records",
      "Keep requests in sync"
    ],
    "tools": [
      {
        "technology": "supabase",
        "role": "Auth manages sessions and Google sign-in; database queries and public-profile RPCs support saved progress and friend discovery."
      },
      {
        "technology": "postgresql",
        "role": "Characters, goals, devotion entries, activity, and friendships are stored as related application records."
      },
      {
        "technology": "react-router",
        "role": "Protected routes wait for authentication before opening the user’s main workspaces."
      }
    ],
    "detail": "Accepted and declined requests dispatch a shared refresh event; returning to the window also refreshes the pending count."
  },
  {
    "id": "scripture-preview",
    "icon": "book",
    "tone": "gold",
    "title": "Scripture inside the Reflection Flow.",
    "summary": "The devotion form turns a book, chapter, and verse range into a passage request using the selected translation. A reading preview sits beside the reflection, with a search fallback when a direct lookup has no content.",
    "steps": [
      "Choose a passage",
      "Preview the reading",
      "Save the reflection"
    ],
    "tools": [
      {
        "technology": "api-bible",
        "role": "Passage and search endpoints retrieve the selected scripture text using the chosen Bible translation."
      },
      {
        "technology": "react",
        "role": "Dependent book, chapter, and verse controls reset together and manage passage loading, preview, and error states."
      }
    ],
    "detail": "The app remembers the user’s preferred available translation for future passage previews."
  },
  {
    "id": "image-exports",
    "icon": "screen",
    "tone": "rose",
    "title": "Keep a Copy outside the App.",
    "summary": "The character profile and a selected devotion entry can be downloaded as PNG images. Each export captures the designed view, giving users a readable keepsake of their character or reflection rather than a raw record dump.",
    "steps": [
      "Choose a profile or entry",
      "Render the designed view",
      "Download a PNG"
    ],
    "tools": [
      {
        "technology": "html2canvas",
        "role": "The export action renders the character card or devotion view to a canvas at double scale, then downloads a PNG."
      },
      {
        "technology": "react",
        "role": "Export refs target the intended profile card or selected calendar entry without capturing the whole application screen."
      }
    ],
    "detail": "The image-rendering library is loaded when an export is requested."
  },
  {
    "id": "app-delivery",
    "icon": "phone",
    "tone": "mint",
    "title": "One Web App, Room to Install.",
    "summary": "Responsive layouts switch from a desktop workspace to phone-sized navigation. PWA configuration supplies the manifest, app icons, standalone display, and service-worker updates, while separate Capacitor projects provide a foundation for Android and iOS packaging.",
    "steps": [
      "Use it in the browser",
      "Add it to the home screen",
      "Open the standalone web app"
    ],
    "tools": [
      {
        "technology": "pwa",
        "role": "The Vite PWA setup configures home-screen installation, standalone display, icons, and automatic service-worker updates."
      },
      {
        "technology": "tailwind",
        "role": "Responsive classes switch desktop navigation to compact phone headers, bottom navigation, and safe-area spacing."
      },
      {
        "technology": "capacitor",
        "role": "The configuration and included Android and iOS projects can package the built web interface for native projects."
      }
    ],
    "detail": "Home-screen installation is available through the browser. Android and iOS project files support a separate native packaging workflow."
  }
];
// END OF FILE: PORTFOLIO-SALT-LIGHT-R8 | saltLightShowcase.js
