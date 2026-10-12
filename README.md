n# gbppimentel-dev — portfolio

This version starts from your working **original React + Vite migration**, not the replacement website in v2. The original visual identity remains: the full-screen three-slide carousel, abstract images, Tilt Warp typography, code-style headlines, illustrated About cards, animated full-screen menu, cursor follower, and hover effects.

## Branding update (0.3.1)

This pass changes the identity to **gbppimentel-dev** while retaining the accepted layout, colors, carousel, animations, and original section artwork.

- New muted-blue **p/** mark with an amber slash, paired with the exact lowercase wordmark.
- New branding in the header, hero, open menu, and footer.
- Glenn Bernard Pimentel appears as a small hero byline, in the About introduction, and in the copyright line.
- Updated browser title, search/social metadata, favicon (16/32/48px), and home-screen icons.
- No new runtime packages are required.

The full logo lockup lives in `src/components/Brand.jsx`; branding sizes and spacing are in `src/styles/branding.css`. The standalone transparent logo is `public/brand/mark-512.png`, and the original full-size generated asset is `public/brand/logo-master.png`. Browser icons live in `public/brand/` and `public/favicon.ico`.

The logo symbol was created with the built-in image-generation tool, then exported at the sizes needed by the site. Design prompt: “A compact, flat geometric lowercase p monogram with a separate forward slash, smoky blue #93AEC6 and muted amber #D8B97C, strong forms that remain readable at favicon size, transparent background, no GB initials and no embedded text.” The exact wordmark is rendered as live text for legibility.

For this update, the production build and existing DOM interaction checks pass. All icon files, brand references, and metadata were checked, and the exported mark was visually inspected. Full browser page rendering remains unverified in this environment.

## Run it in VS Code

1. Extract `gbppimentel-dev-branding.zip` into a **new folder**. Keep your current working copy until you have compared them.
2. In VS Code, choose **File → Open Folder** and open the extracted `gbppimentel-dev` folder. You should see `package.json` directly inside it.
3. Choose **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite. Press **Ctrl+C** in the terminal to stop the server.

The project requires Node.js 20.19+ in the Node 20 series, or 22.12+ in newer supported releases (the same requirement as the original migration).

To check a production build:

```bash
npm run build
npm run preview
```

## What changed

- **Same original artwork.** Backgrounds use CSS saturation and brightness adjustments on separate decorative layers. Text, links, screenshots, and the resume do not inherit those filters. Original image files have not been edited.
- **Darker color treatment.** Ink and charcoal with smoky blue, muted amber, dusty coral, and lilac details. The original graphic compositions remain visible.
- **Original animation style.** Sliding/parallax carousel, looping slides, animated menu layers and hamburger, button text rollover, cursor follower, and back-to-top interaction remain. The slides have a pause button and respect reduced-motion preferences.
- **Same site structure.** Home → About Me → Projects → Awards → Contact. All are sections on the same page. No Notebook or unrelated new page structure.
- **The existing unfinished sections now have a base.** Projects contains Salt & Light and LifeCity Attendance; Artworks and Games have honest empty states. Awards has a placeholder until actual entries are added. Contact uses the existing LinkedIn URL and resume.
- **Responsive CSS adjustments.** Scalable hero text, controls along the bottom on phones, two-column About cards on tablets, one-column cards on phones, and larger menu targets.
- **Local fonts.** Tilt Warp, Poppins, and Roboto are included with their licenses. The live app no longer needs Google Fonts requests.

## Where to edit

| What you want to change | File |
| --- | --- |
| Palette, artwork saturation, spacing, responsive rules | `src/styles/refinement.css` |
| Logo lockup and brand spacing | `src/components/Brand.jsx`, `src/styles/branding.css` |
| Original underlying theme styles | `src/styles/style.css` |
| Three hero slides and their wording | `src/components/Hero.jsx` |
| About Me text and four illustrated cards | `src/components/About.jsx` |
| Social links, project entries, awards, contact details | `src/data.js` |
| Project layout and filters | `src/components/Projects.jsx` |
| Menu | `src/components/Navigation.jsx` |
| Contact and footer | `src/components/Footer.jsx` |
| Original graphics | `public/images/` |
| Resume PDF | `public/Pimentel-Resume-IT.pdf` |

### Adjust the colors

Open `src/styles/refinement.css`. The `:root` block at the top contains the palette:

```css
--ink: #14151b;
--blue: #93aec6;
--amber: #d8b97c;
--coral: #d79998;
--lilac: #aaa0cb;
```

The same file controls the background treatment using `--art-saturation` and `--art-brightness`. Slide two and slide three have individual overrides because their source images are much brighter than slide one. The menu, About section, and footer have their own filters in that file. Search for `filter:` to tune each one.

### Add real project material

Open `src/data.js` and find an item in `projects`.

1. Put a screenshot in `public/images/projects/`, creating the folder if needed.
2. Set `screenshot` to a path such as `images/projects/salt-and-light.png` (do not include `public/`).
3. Add the actual `liveUrl` and/or `sourceUrl` when ready. Empty values do not create links.
4. Add a `details` paragraph to show an expandable description.
5. Update `status` and `description` to match the project. The original graphic tile is a cover, not a claimed app screenshot.

To add a project, copy an existing object, give it a unique `id`, and choose `Web development`, `Artworks`, or `Games` as the category. Additional projects appear automatically.

### Add awards

The `awards` array in `src/data.js` starts empty. Replace it with real entries, for example:

```js
export const awards = [
  {
    title: 'Your actual award or certification',
    organization: 'The issuing organization',
    year: '2026',
    url: '',
  },
];
```

The placeholder automatically becomes a list. No sample award is presented as a real achievement.

### Contact and resume

Set `contact.email` in `src/data.js` when you want a public email link. Until then the main contact button goes to the existing LinkedIn profile. The footer keeps the original social accounts, with GitHub pointing to `gbppimentel-dev`.

The included resume and About text are carried over from the original migration. Update those files directly when your professional content is ready.

## Validation

- Production build passes.
- DOM interaction checks pass: menu open/close, keyboard focus, Escape, About navigation, project filters, valid section anchors, and reduced-motion autoplay behavior.
- Local asset and archive integrity checks pass.
- **Rendered browser visual checks remain unverified.** Chromium could not launch in this execution environment. Review the layout locally on desktop, tablet, and phone before publishing, including all three slides and the open menu. The DOM checks do not prove pixel layout or touch behavior.

This ZIP does not change or deploy your GitHub repository. Relative asset paths are retained for hosting below a repository path. The original archived HTML/JavaScript remains in `legacy/`; the React application does not execute those old scripts. Font licenses are included under `public/fonts/`.
