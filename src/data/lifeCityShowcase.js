// CHANGE VERSION: PORTFOLIO-LIFECITY-R2 | Verified LifeCity screens and app-specific case study content
// Supplied app captures and source-built demonstrations; records and totals are illustrative.
export const lifeCityScreens = [
  {
    "id": "welcome-desktop",
    "src": "images/projects/lifecity-r2/welcome-desktop.png",
    "label": "Welcome to LifeCity",
    "alt": "LifeCity welcome page with a community introduction, Google sign-in, and guest entry.",
    "caption": "A welcoming entry point with Google sign-in and guest access.",
    "width": 1702,
    "height": 938,
    "layout": "desktop",
    "group": "welcome"
  },
  {
    "id": "welcome-mobile",
    "src": "images/projects/lifecity-r2/welcome-mobile.png",
    "label": "Welcome on Mobile",
    "alt": "LifeCity mobile welcome page with community messaging, Google sign-in, guest access, and a compact footer.",
    "caption": "The same welcome adapts into a compact phone layout.",
    "width": 424,
    "height": 832,
    "layout": "phone",
    "group": "welcome"
  },
  {
    "id": "dashboard-desktop",
    "src": "images/projects/lifecity-r2/dashboard-desktop.png",
    "label": "Dashboard Overview",
    "alt": "LifeCity desktop dashboard with member and event totals, attendance summaries, and recent Sunday and upcoming event panels.",
    "caption": "Member totals, event summaries, and attendance activity share one dashboard.",
    "width": 1199,
    "height": 868,
    "layout": "desktop",
    "group": "dashboard"
  },
  {
    "id": "dashboard-mobile",
    "src": "images/projects/lifecity-r2/dashboard-mobile.png",
    "label": "Mobile Dashboard",
    "alt": "LifeCity mobile dashboard with Scanner and Records shortcuts, summary tiles, upcoming gathering details, updates, and bottom navigation.",
    "caption": "Mobile navigation puts common check-in tools and upcoming events within reach.",
    "width": 422,
    "height": 839,
    "layout": "phone",
    "group": "dashboard"
  },
  {
    "id": "member-directory",
    "src": "images/projects/lifecity-r2/member-directory.png",
    "label": "Member Directory",
    "alt": "Member Directory in the actual LifeCity application, using synthetic demonstration records.",
    "caption": "The real member directory layout, with filters, ministry and church assignments, and sample records. All names and contact details in this capture are synthetic.",
    "width": 1440,
    "height": 1622,
    "layout": "desktop",
    "group": "members",
    "synthetic": true
  },
  {
    "id": "member-registration",
    "src": "images/projects/lifecity-r2/member-registration.png",
    "label": "Register a Member",
    "alt": "LifeCity registration form with name, contact fields, active status, an admin note, and church selections.",
    "caption": "A single form collects contact details, church membership, and private admin notes.",
    "width": 1149,
    "height": 772,
    "layout": "desktop",
    "group": "members"
  },
  {
    "id": "members-import",
    "src": "images/projects/lifecity-r2/members-import.png",
    "label": "CSV Member Import",
    "alt": "LifeCity CSV import workspace with a template download, three-step guide, and file upload area.",
    "caption": "Template-driven bulk registration brings member records into the directory.",
    "width": 1169,
    "height": 528,
    "layout": "desktop",
    "group": "members"
  },
  {
    "id": "members-export",
    "src": "images/projects/lifecity-r2/members-export.png",
    "label": "Directory Export",
    "alt": "Directory Export in the actual LifeCity application, using synthetic demonstration records.",
    "caption": "Quick and detailed CSV choices in the actual export panel, shown with synthetic sample member records.",
    "width": 1120,
    "height": 1187,
    "layout": "desktop",
    "group": "members",
    "synthetic": true
  },
  {
    "id": "member-space",
    "src": "images/projects/lifecity-r2/member-space.png",
    "label": "My Member Space",
    "alt": "Actual LifeCity member space with a synthetic profile and attendance QR entry point.",
    "caption": "The member’s own profile and QR workspace, rendered from the actual app with synthetic sample information.",
    "width": 1120,
    "height": 776,
    "layout": "desktop",
    "group": "member",
    "synthetic": true
  },
  {
    "id": "member-id-export",
    "src": "images/projects/lifecity-r2/member-id-export.png",
    "label": "Downloadable Member ID",
    "alt": "Actual LifeCity generated member ID for a synthetic demo member and a non-production QR token.",
    "caption": "A real PNG ID produced by the app’s own canvas export, using a synthetic member and an invalid demonstration QR token.",
    "width": 1600,
    "height": 1000,
    "layout": "desktop",
    "group": "members",
    "synthetic": true
  },
  {
    "id": "services-desktop",
    "src": "images/projects/lifecity-r2/services-desktop.png",
    "label": "Services & Events",
    "alt": "LifeCity services workspace with a new-service action, search, status and calendar filters, and CSV export options.",
    "caption": "Services can be organized before check-in and filtered as the event list grows.",
    "width": 1152,
    "height": 839,
    "layout": "desktop",
    "group": "services"
  },
  {
    "id": "service-create-mobile",
    "src": "images/projects/lifecity-r2/service-create-mobile.png",
    "label": "Create an Event on Mobile",
    "alt": "LifeCity mobile event form with name, date, time, optional location, and private service-note fields.",
    "caption": "Event setup uses a compact form suited to a phone screen.",
    "width": 415,
    "height": 671,
    "layout": "phone",
    "group": "services"
  },
  {
    "id": "scanner-desktop",
    "src": "images/projects/lifecity-r2/scanner-desktop.png",
    "label": "QR Check-In Station",
    "alt": "LifeCity check-in station with a selected service, check-in count, kiosk mode, readiness indicator, and camera scanner frame.",
    "caption": "A service-specific station brings QR scanning and kiosk access together.",
    "width": 812,
    "height": 791,
    "layout": "desktop",
    "group": "checkin"
  },
  {
    "id": "scanner-mobile",
    "src": "images/projects/lifecity-r2/scanner-mobile.png",
    "label": "Mobile QR Scanner",
    "alt": "LifeCity phone scanner with a service selector, check-in counter, kiosk action, large camera frame, and bottom navigation.",
    "caption": "A phone-sized scanner keeps the service and scanning area together.",
    "width": 424,
    "height": 838,
    "layout": "phone",
    "group": "checkin"
  },
  {
    "id": "manual-checkin",
    "src": "images/projects/lifecity-r2/manual-checkin.png",
    "label": "Manual Check-In",
    "alt": "LifeCity manual check-in search field for finding a member by name, mobile number, member ID, or email when a QR cannot be scanned.",
    "caption": "Manual search remains available when a member cannot present a QR code.",
    "width": 754,
    "height": 182,
    "layout": "desktop",
    "group": "checkin"
  },
  {
    "id": "attendance-records",
    "src": "images/projects/lifecity-r2/attendance-records.png",
    "label": "Attendance Records",
    "alt": "LifeCity attendance records workspace with check-in totals, unique-member and service counts, filters, and an Export CSV action.",
    "caption": "Attendance totals and filters provide a clear starting point for reports.",
    "width": 1202,
    "height": 816,
    "layout": "desktop",
    "group": "records"
  },
  {
    "id": "attendance-history",
    "src": "images/projects/lifecity-r2/attendance-history.png",
    "label": "Attendance Records",
    "alt": "Attendance Records in the actual LifeCity application, using synthetic demonstration records.",
    "caption": "Filtered attendance reporting in the actual Records workspace. The member records, counts and check-in times shown are synthetic examples.",
    "width": 1120,
    "height": 913,
    "layout": "desktop",
    "group": "records",
    "synthetic": true
  },
  {
    "id": "records-export",
    "src": "images/projects/lifecity-r2/records-export.png",
    "label": "Report Export Options",
    "alt": "LifeCity report export center showing Quick CSV and Detailed CSV choices, a Refresh action, and attendance summary tiles.",
    "caption": "Report exports offer a compact file or a detailed record set for further review.",
    "width": 1167,
    "height": 583,
    "layout": "desktop",
    "group": "records"
  },
  {
    "id": "appearance-settings",
    "src": "images/projects/lifecity-r2/appearance-settings.png",
    "label": "Appearance Workspace",
    "alt": "LifeCity appearance editor with primary and secondary accent controls and a live interface preview.",
    "caption": "Color choices can be reviewed against a live preview of the app interface.",
    "width": 1301,
    "height": 859,
    "layout": "desktop",
    "group": "settings"
  },
  {
    "id": "workspace-mobile",
    "src": "images/projects/lifecity-r2/workspace-mobile.png",
    "label": "Mobile Workspace Menu",
    "alt": "LifeCity mobile workspace sheet with Members, Records, My Member Space, and Settings destinations over the services view.",
    "caption": "Less frequent tools remain accessible from a dedicated mobile workspace sheet.",
    "width": 426,
    "height": 832,
    "layout": "phone",
    "group": "settings"
  },
  {
    "id": "feedback-workspace",
    "src": "images/projects/lifecity-r2/feedback-workspace.png",
    "label": "Owner Feedback Workspace",
    "alt": "LifeCity owner feedback workspace with status and category filters, search, and ticket cards for reports submitted through the app.",
    "caption": "An owner workspace keeps submitted feedback searchable and manageable.",
    "width": 1287,
    "height": 830,
    "layout": "desktop",
    "group": "settings"
  },
  {
    "id": "feedback-desktop",
    "src": "images/projects/lifecity-r2/feedback-desktop.png",
    "label": "Send App Feedback",
    "alt": "LifeCity feedback form with Bug Report, Feature Idea, Improvement, Other, subject and message fields, and an identity-hiding option.",
    "caption": "A focused feedback form keeps issue reports and ideas inside the app.",
    "width": 600,
    "height": 714,
    "layout": "desktop",
    "group": "settings"
  },
  {
    "id": "feedback-mobile",
    "src": "images/projects/lifecity-r2/feedback-mobile.png",
    "label": "Mobile Feedback Sheet",
    "alt": "LifeCity mobile feedback sheet over the dashboard with report categories, message fields, and an identity-hiding option.",
    "caption": "Feedback opens as a focused sheet on a phone.",
    "width": 469,
    "height": 878,
    "layout": "phone",
    "group": "settings"
  }
];

export const lifeCityChapters = [
  {
    "id": "overview",
    "label": "Overview",
    "title": "A Clear View of the Gathering.",
    "description": "LifeCity brings member information, service activity, and recent check-ins into one workspace. Church teams can review the bigger picture, then move straight into the service or record that needs attention.",
    "highlights": [
      "Member, service, and check-in summaries by period",
      "Recent activity and the active check-in service",
      "Sunday attendance measured against active members",
      "A dedicated compact dashboard on mobile"
    ],
    "icon": "dashboard",
    "tone": "mint",
    "screenIds": [
      "dashboard-desktop",
      "dashboard-mobile"
    ],
    "note": "Guests can explore public gatherings; linked members and church teams each have a workspace suited to their role."
  },
  {
    "id": "members",
    "label": "Members",
    "title": "Member Records, Ready for the Team.",
    "description": "A member profile keeps contact details, church and ministry assignments, status, notes, and QR identity together. Search and filters help the team find the right person, while registration and CSV review keep the directory manageable.",
    "highlights": [
      "Search, sorting, church/ministry filters, and server-backed pages",
      "Active or inactive status, starred members, and bulk actions",
      "CSV validation with duplicate review and inline corrections",
      "Quick or detailed member exports and downloadable QR IDs"
    ],
    "icon": "users",
    "tone": "lilac",
    "screenIds": [
      "member-directory",
      "members-import",
      "member-registration"
    ],
    "note": "Imported rows are reviewed and revalidated before submission; contact conflicts and possible duplicate names are shown separately."
  },
  {
    "id": "services",
    "label": "Services",
    "title": "Plan the Service. Keep Its Context.",
    "description": "Create services with a date, time, venue, and optional note, then keep the list organised through search and calendar filters. Sunday reporting and guest visibility are deliberate choices, while archiving preserves a service’s history.",
    "highlights": [
      "Create and edit services from desktop or phone",
      "Upcoming, In Progress, Completed, and Archived states",
      "Separate Sunday-service reporting and public guest visibility",
      "Archive and restore services without removing their attendance"
    ],
    "icon": "calendar",
    "tone": "gold",
    "screenIds": [
      "services-desktop",
      "service-create-mobile"
    ],
    "note": "A service with check-ins is archived rather than deleted, keeping its attendance history available."
  },
  {
    "id": "checkin",
    "label": "Check-In",
    "title": "Scan. Confirm. Welcome Them In.",
    "description": "Choose the service, open the camera, and scan the member’s QR. Clear results distinguish a new check-in, an existing check-in, and an inactive member. Manual search stays available when a QR cannot be presented.",
    "highlights": [
      "Service-specific QR scanning with camera switching",
      "Manual search by name, member ID, mobile, or email",
      "Duplicate handling and clear success/error feedback",
      "A focused kiosk with optional sound and vibration"
    ],
    "icon": "scan",
    "tone": "mint",
    "screenIds": [
      "scanner-desktop",
      "scanner-mobile",
      "manual-checkin"
    ],
    "note": "Kiosk mode uses browser fullscreen when available and a viewport-filling layout when it is not."
  },
  {
    "id": "records",
    "label": "Records",
    "title": "Attendance with the Details Attached.",
    "description": "The records workspace connects attendance to the person, gathering, church, ministry, and check-in time. Filter the report to answer a specific question, inspect a record, or export the complete matching result.",
    "highlights": [
      "Service, church, ministry, member, and date filters",
      "Completed, current, and archived service scopes",
      "Record details with service and member snapshots",
      "Quick and detailed CSV exports across every matching page"
    ],
    "icon": "records",
    "tone": "lilac",
    "screenIds": [
      "attendance-history",
      "records-export"
    ],
    "note": "Exports verify row totals and report revisions before a download is offered, so a partial or changed result is not presented as complete."
  },
  {
    "id": "member-space",
    "label": "Member Space",
    "title": "Your Member Space.",
    "description": "A member’s sign-in connects to an existing church record through a reviewed linking request. The personal space keeps the member QR, downloadable ID, upcoming gatherings, attendance history, and profile updates together.",
    "highlights": [
      "Google sign-in linked to an existing member profile",
      "Personal attendance QR and a downloadable digital ID",
      "Upcoming gatherings and personal attendance history",
      "Direct mobile updates and reviewed profile-change requests"
    ],
    "icon": "id",
    "tone": "gold",
    "screenIds": [
      "member-space",
      "member-id-export"
    ],
    "note": "Connecting a member profile keeps the existing attendance identity; it does not grant administrator access."
  },
  {
    "id": "appearance",
    "label": "Appearance",
    "title": "A Palette That Feels Like LifeCity.",
    "description": "The owner can explore the shared palette against an interactive preview before saving it. Brand colors, surfaces, text, and interface states use common tokens, keeping the app recognisable across desktop and compact mobile workspaces.",
    "highlights": [
      "Shared color controls grouped by their role in the interface",
      "Interactive preview before saving the palette",
      "Original colors available through a reset action",
      "Optional device motion settings and reduced-motion support"
    ],
    "icon": "palette",
    "tone": "lilac",
    "screenIds": [
      "appearance-settings",
      "workspace-mobile"
    ],
    "note": "Camera video and member QR graphics keep their original colors while the interface adapts around them."
  },
  {
    "id": "feedback",
    "label": "Feedback",
    "title": "Feedback & Follow-Up.",
    "description": "A feedback form gives members a place to report a bug, suggest an idea, or ask for an improvement. The owner can review tickets by status and category, while the sender can follow updates from their member space.",
    "highlights": [
      "Bug Report, Feature Idea, Improvement, and Other categories",
      "A private owner inbox with search and status filters",
      "New, In Progress, Completed, and Considered ticket states",
      "Feedback updates shown to the sender in their member space"
    ],
    "icon": "message",
    "tone": "gold",
    "screenIds": [
      "feedback-workspace",
      "feedback-desktop",
      "feedback-mobile"
    ],
    "note": "Identity hiding masks the sender in the inbox; the form explains that the owner can reveal it for review."
  }
];

export const lifeCityBuildStories = [
  {
    "id": "token-checkin",
    "icon": "scan",
    "tone": "mint",
    "title": "A Private Token, One Check-In per Service.",
    "summary": "The QR encodes an opaque member token. The scanner looks up the active member and inserts attendance for the selected service, with explicit duplicate feedback when the unique member/service constraint rejects another record.",
    "steps": [
      "Decode the QR token",
      "Resolve the active member",
      "Record or recognise the check-in"
    ],
    "tools": [
      {
        "technology": "qrcode-react",
        "role": "Renders an att: token as an SVG QR, keeping personal details out of the code."
      },
      {
        "technology": "html5-qrcode",
        "role": "Reads the camera frames and submits a decoded value to the same attendance flow used by manual selection."
      },
      {
        "technology": "supabase",
        "role": "Looks up the member and inserts the selected member/service attendance pair; SQL error 23505 becomes duplicate feedback."
      }
    ],
    "detail": "An attempt counter, processing lock and cooldown prevent stale results or a QR held in the camera from repeatedly interrupting the flow."
  },
  {
    "id": "reviewed-import",
    "icon": "upload",
    "tone": "lilac",
    "title": "Review the Import before Saving.",
    "summary": "Papa Parse turns CSV data into rows; app-owned validation normalises contacts, checks required information and flags duplicates. Corrections happen in the preview, and the final submission rechecks the current directory before calling the import RPC.",
    "steps": [
      "Parse and normalise",
      "Review and correct rows",
      "Revalidate and submit"
    ],
    "tools": [
      {
        "technology": "papaparse",
        "role": "Reads headers and CSV rows, including quoted fields, before the app maps accepted column aliases."
      },
      {
        "technology": "typescript",
        "role": "Typed review rows carry validation issues, duplicate-name overrides and editable fields through the import state."
      },
      {
        "technology": "supabase",
        "role": "Reads current contact data and submits the reviewed batch with a retained request ID so uncertain results can be checked again."
      }
    ],
    "detail": "Skipped or invalid rows can be downloaded for review. The request ID is retained across uncertain retries rather than creating a second independent batch."
  },
  {
    "id": "complete-reports",
    "icon": "download",
    "tone": "gold",
    "title": "Complete Exports, Checked before Download.",
    "summary": "The report request captures filters, sort order and an as-of time. Export then fetches all matching records in 500-row batches, verifies totals and revision throughout, and downloads only after the complete response has been confirmed.",
    "steps": [
      "Capture the report filters",
      "Fetch and verify every batch",
      "Download the complete CSV"
    ],
    "tools": [
      {
        "technology": "supabase",
        "role": "Calls attendance_report_v4 for paginated UI results and every export batch using the same captured request."
      },
      {
        "technology": "web-apis",
        "role": "Formats quick/detailed CSVs, handles progress and cancellation, neutralises spreadsheet formula prefixes and saves the Blob only after verification."
      },
      {
        "technology": "typescript",
        "role": "Typed report rows preserve snapshot fields, member/service details and timestamps consistently between display and export."
      }
    ],
    "detail": "A changed revision, unexpected batch size or failed request stops the file download; a final small query checks for changes during the last batch."
  },
  {
    "id": "roles-linking",
    "icon": "shield",
    "tone": "mint",
    "title": "Link Accounts to Existing Member Records.",
    "summary": "Google sign-in creates an app session, while a separate account response selects the member, administrator or owner workspace. A member-link request is reviewed against an existing directory record before the personal portal opens.",
    "steps": [
      "Restore the signed-in account",
      "Review the member connection",
      "Open the appropriate workspace"
    ],
    "tools": [
      {
        "technology": "supabase",
        "role": "Auth handles Google OAuth and session restoration; account and review RPCs connect a signed-in user to the relevant member record."
      },
      {
        "technology": "react",
        "role": "Renders separate account states and workspaces while account access is loading, active, suspended or not yet linked."
      },
      {
        "technology": "typescript",
        "role": "Role/status and expected-update values make account and review states explicit in the client."
      }
    ],
    "detail": "Linking does not grant administrator access. Profile requests display before/requested/current values and require a fresh review when the record has changed."
  },
  {
    "id": "live-data",
    "icon": "activity",
    "tone": "lilac",
    "title": "Live Updates That Follow Your Filters.",
    "summary": "Dashboard and service lists use server-backed snapshots/pages rather than deriving all totals from one visible table page. Realtime signals queue refreshes, and request-sequence checks keep a slow response from overwriting a newer filter selection.",
    "steps": [
      "Capture the current view",
      "Request a snapshot or page",
      "Accept only the current result"
    ],
    "tools": [
      {
        "technology": "supabase",
        "role": "Database subscriptions trigger debounced dashboard/service refreshes; RPCs return filtered totals, active counts and rows together."
      },
      {
        "technology": "react",
        "role": "Refs, sequence counters and request keys tie each response to the active period, service or directory filter."
      },
      {
        "technology": "javascript",
        "role": "Debounces search and refresh events, and periodically reevaluates time-sensitive service states."
      }
    ],
    "detail": "The dashboard uses a 250ms refresh debounce and a 60-second clock for reporting boundaries and the three-hour check-in window."
  },
  {
    "id": "camera-kiosk",
    "icon": "camera",
    "tone": "gold",
    "title": "Camera Controls with a Kiosk Fallback.",
    "summary": "Camera scanning is a browser capability, not an assumed permission. The scanner checks the secure context, starts and clears the camera lifecycle, supports switching, and provides a fullscreen kiosk with a viewport fallback when native fullscreen is unavailable.",
    "steps": [
      "Request camera access",
      "Focus the kiosk workspace",
      "Confirm the scan result"
    ],
    "tools": [
      {
        "technology": "html5-qrcode",
        "role": "Owns QR camera decoding, scan configuration, camera switching and stop/clear cleanup."
      },
      {
        "technology": "web-apis",
        "role": "Media, Fullscreen, Web Audio and vibration APIs supply permission-aware camera presentation and optional scan confirmation."
      },
      {
        "technology": "css",
        "role": "A viewport-filling kiosk fallback keeps the scanner usable when browser fullscreen is blocked or unavailable."
      }
    ],
    "detail": "Manual member search remains available as an alternative. Sound and vibration are enhancements; unavailable feedback does not block a successful check-in."
  },
  {
    "id": "responsive-motion",
    "icon": "phone",
    "tone": "mint",
    "title": "A Mobile Workspace with Its Own Layout.",
    "summary": "Dedicated mobile layouts replace wide desktop structures where the workflow needs it: compact dashboard cards, mobile navigation, folded filters and a single-screen scanner. Shared tokens keep the styling coherent across screen sizes.",
    "steps": [
      "Keep the workflow recognisable",
      "Adapt controls to the screen",
      "Respect motion preferences"
    ],
    "tools": [
      {
        "technology": "css",
        "role": "Dedicated mobile dashboard, scanner, services and workspace styles change layout and navigation at responsive breakpoints."
      },
      {
        "technology": "react",
        "role": "Mobile-specific dashboard states, responsive selects and collapsible tools provide compact controls rather than scaling the desktop view."
      },
      {
        "technology": "web-apis",
        "role": "The Web Animations API provides page transitions; a saved device preference and prefers-reduced-motion decide whether effects run."
      },
      {
        "technology": "web-manifest",
        "role": "Provides the app name, icons, scope, and standalone display metadata for home-screen identity in supported browsers."
      }
    ],
    "detail": "The same browser app uses compact navigation and phone-specific layouts, while reduced-motion preferences can switch the optional effects off."
  },
  {
    "id": "id-feedback",
    "icon": "id",
    "tone": "lilac",
    "title": "Downloadable IDs & Traceable Feedback.",
    "summary": "The member portal renders a designed ID image from the current profile and QR graphic, while feedback submissions carry a retryable request ID into a private owner inbox. Members can see ticket status updates in their own space.",
    "steps": [
      "Open the personal member space",
      "Download an ID or submit feedback",
      "Keep the result connected"
    ],
    "tools": [
      {
        "technology": "qrcode-react",
        "role": "Produces the SVG QR used by the portal display and ID export."
      },
      {
        "technology": "web-apis",
        "role": "Canvas draws the ID layout and QR into a downloadable PNG; Web Crypto creates feedback request IDs retained across uncertain retries."
      },
      {
        "technology": "supabase",
        "role": "Member portal and feedback RPCs retrieve personal content, submit feedback and update ticket status."
      }
    ],
    "detail": "The ID image is composed locally from the member profile and QR graphic; feedback remains connected to its request and ticket status."
  }
];

// END OF FILE: PORTFOLIO-LIFECITY-R2 | lifeCityShowcase.js
