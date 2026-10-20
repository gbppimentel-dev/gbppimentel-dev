<!-- CHANGE VERSION: HEADER-HEARTS-R1 | 2026-10-20 | Portfolio launch guide -->
# Put your portfolio online

The header has a subtle “Loved what you see? Give this page a heart!” interaction on every page. Its small outline heart keeps the PulseHeart animation, and the prompt changes to “Thanks!” once the saved heart is confirmed. The count is stored in Supabase and shared across visitors. Visitors do not need accounts. Their browser keeps a random ID so a refresh remembers their heart, and clicking again removes it.

The ZIP contains your complete current project, including all existing images and other assets. Extract its contents into your existing project root, where `package.json` already lives, and replace matching files. Do not put the whole project inside another nested folder. `README.md` and the package versions are unchanged. There are no new npm dependencies.

The site is ready to build, but the database and GitHub settings below still need to be connected. Until then, the heart is disabled and does not invent a total. The other pages work normally.

## 1. Create the shared heart storage

1. Sign in at [Supabase](https://supabase.com/dashboard). Create a project for the portfolio, or select a project you want to use.
2. Open **SQL Editor**, then **New query**.
3. In the extracted project, open `supabase/portfolio-hearts.sql`. Copy the entire file, paste it into that query, and click **Run**. No edits to the SQL are needed. Running it again preserves existing hearts.
4. Open the project’s **Connect** dialog to find its **Project URL** and **Publishable key**. The key starts with `sb_publishable_`. You can also find keys under **Settings → API Keys**.
5. Keep those two values for the next step. Do not use a secret key or a service-role key; those do not belong in browser code.

The SQL creates one portfolio-only table and two narrow database functions. Visitors can read the total and set their own browser’s heart; direct access to the table is denied. Repeated requests to add the same browser’s heart count once.

## 2. Choose your GitHub repository

Use the repository that already contains this project if you have one. The workflow adapts to its name automatically.

If you are creating a new repository under the GitHub account linked on your site, naming it `gbppimentel-dev.github.io` gives you the address `https://gbppimentel-dev.github.io/`. This assumes that is the account you use and that the repository name is available. A regular repository such as `portfolio` gives an address like `https://gbppimentel-dev.github.io/portfolio/`.

The repository root must contain `package.json`, `vite.config.js`, `src`, `public`, and `.github/workflows/deploy.yml`. The archive already includes that workflow. Use a public repository for the simplest Pages setup, or a private repository if your GitHub plan supports Pages for it.

## 3. Connect the two public settings

In that GitHub repository:

1. Open **Settings → Secrets and variables → Actions**.
2. Select the **Variables** tab, then **New repository variable**.
3. Add these two variables, one at a time:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL, such as `https://your-project.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key, starting with `sb_publishable_` |

These are public frontend settings. Your database password and any Supabase secret key are not needed for this website.

The workflow reads these values during its build. Changing a variable requires another deployment before the live site uses it.

## 4. Enable GitHub Pages and publish

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. In Codespaces, merge the extracted files into your current project. Open the **Source Control** panel, stage the changed files, enter a message such as `Add portfolio hearts and Pages deployment`, then commit and sync/push to your repository’s default branch. If this is a new repository, upload the complete project first, including the `.github` folder.
4. Open the repository’s **Actions** tab and select **Deploy portfolio to GitHub Pages**.
5. A push to the default branch starts the deployment automatically. You can also select **Run workflow**, choose the default branch, then confirm **Run workflow**. If an earlier run failed before you enabled Pages or added the variables, start a new run now.
6. Wait for both **build** and **deploy** to turn green. Open the website link shown by the deployment or under **Settings → Pages**. That link is your live site.

You do not need to create a `gh-pages` branch, upload `node_modules`, edit an asset path, or manually build the `dist` folder. GitHub builds and publishes it. Your existing hash-based navigation works on Pages without a special routing fallback.

## 5. Check the live site

1. Open the hero, About, Contact, Projects and NetSuite pages. Check the images, resume and menu.
2. In the header, wait for the heart count to load. Click the heart: it animates, saves, updates the shared total, and displays “Thanks!”.
3. Refresh. Your heart should stay selected. Click again to remove it.
4. Open the site in another browser to confirm the shared total is the same. That browser has its own heart selection. Totals refresh when the header mounts or you return focus to the page; this is not a continuously streaming counter.

One heart is remembered per browser profile for this website, rather than verified per person. Clearing site storage, private browsing, a different device or a different site origin creates a new browser identity.

If the heart remains disabled with “Hearts are taking a little break,” check the two repository variables and start a new workflow run. If the heart shows a retry message, confirm the SQL ran successfully in the same Supabase project, that the project is available, and that the URL/key match it. A failed save rolls back the visible change so it does not pretend a heart was stored.

For local development, this update includes a ready-to-use `.env.development.local` with the same public frontend configuration already used by the live site. Extract this file into the project root alongside `package.json`. Stop the current dev server with **Ctrl+C**, then start it again with `npm run dev`. No code or key edits are needed. This works for Vite development previews, including Codespaces.

Local clicks use the real shared database, so they affect the same total as the live site. Localhost and the live website each keep their own browser identity; use the heart again to undo a test reaction if desired. The development configuration file is ignored by Git and is not loaded by a normal production build. GitHub Pages continues to use your existing repository variables. It contains only the public project URL and publishable key, not a database password or server secret.

## Continue polishing

Keep working on the same source. Each push to the default branch rebuilds and updates the live site. The hearts stay in Supabase when the frontend is redeployed. Avoid deleting the `portfolio_hearts` table if you want to keep its total.

The contact form remains a frontend message preview as before; publishing does not turn it into a working inbox.

## Official references

- [Vite: GitHub Pages deployment](https://vite.dev/guide/static-deploy#github-pages)
- [GitHub: using custom workflows with Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Supabase: API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase: database functions](https://supabase.com/docs/guides/database/functions)

<!-- END OF FILE: HEADER-HEARTS-R1 | DEPLOYMENT.md -->
