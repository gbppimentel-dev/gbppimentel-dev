<!-- CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Complete migration and testing guide -->
# Move the portfolio heart counter to Cloudflare

This update contains the complete Worker, database schema, migration tools, and frontend connection. It does not sign in to your Cloudflare account or change your Supabase projects automatically.

The portfolio stays on GitHub Pages. Cloudflare Workers handles its heart requests, and D1 stores the heart records. LifeCity and Salt & Light can then use your two active Supabase projects.

Your existing browser identifiers are retained. Migrating the records preserves the total and lets returning visitors keep their own heart state. The original Supabase project remains available as a rollback until you choose to pause it.

## 1. Apply the update and install the deployment tools

Extract and merge the complete supplied update into your portfolio folder. Run all commands below from the folder containing the portfolio's main `package.json`.

Use Node.js 22.12 or newer; Node 24 LTS is suitable. Check your version with:

```bash
node --version
```

Install the included Cloudflare tools:

```bash
npm --prefix cloudflare/hearts ci
```

No paid Cloudflare plan is required for this setup within its Free allowances. Create a free account at [Cloudflare](https://dash.cloudflare.com/sign-up) if you do not already have one. If asked to select or create a Workers plan, use **Free**.

## 2. Sign in and prepare the new database

```bash
npm run hearts:setup -- login
```

Approve the Cloudflare sign-in in your browser, then return to the terminal.

```bash
npm run hearts:setup -- init
```

The helper finds or creates `gbppimentel-portfolio-hearts`, fills the actual database ID into the Worker configuration, and creates its tables. You do not need to add configuration lines yourself.

If you have several Cloudflare accounts and the command cannot choose one, copy the **Account ID** from the correct Cloudflare Dashboard account and run:

```bash
npm run hearts:setup -- account YOUR_CLOUDFLARE_ACCOUNT_ID
npm run hearts:setup -- init
```

This is an Account ID, not an API token. The helper never needs a Supabase service-role key.

## 3. Freeze the old counter and export its final records

Do this when you are ready to finish the move. The portfolio remains usable and its old count remains readable, but adding or removing hearts is temporarily stopped so the export cannot become outdated during migration.

1. Open your **gbppimentel-dev portfolio project** in the Supabase Dashboard. Confirm that you are not opening LifeCity or Salt & Light.
2. Open **SQL Editor → New query**.
3. Open the supplied file `supabase/freeze-portfolio-hearts-for-migration.sql`, copy its complete contents into the query, and click **Run**.
4. Open another query, copy the complete contents of `supabase/export-portfolio-hearts.sql`, and click **Run**.
5. Download that query's result as **CSV**, including column headers. Rename the download to `portfolio-hearts.csv`.
6. Copy or upload the CSV into the ignored folder `cloudflare/hearts/.migration/`, which the setup helper created. Keep this export private; do not commit it or put it under `public/`.

Do not pause or delete the Supabase project yet. Keep the exported CSV until the entire move is verified.

## 4. Import and verify the records

```bash
npm run hearts:setup -- import cloudflare/hearts/.migration/portfolio-hearts.csv
```

The helper validates every row, retains timestamp precision, rejects invalid or duplicate browser IDs, imports without creating duplicates, and checks that the remote count matches the export. It prints counts, not visitor identifiers.

Continue only when the terminal says **Verified: N hearts in Cloudflare, matching the frozen CSV export.** An export with zero hearts is also supported.

If an import fails, the source Supabase records are still present. Repeating the same validated import is safe. The helper refuses to remove target records or silently discard invalid source records; stop and review its message if it reports a mismatch.

## 5. Publish and verify the Worker

```bash
npm run hearts:setup -- deploy
```

If Cloudflare asks you to register a `workers.dev` subdomain, follow the terminal prompt. When deployment finishes, copy the production HTTPS address ending in `.workers.dev` and paste it when the helper asks. Include only the address, without `/api/hearts`.

The helper checks the Worker health, the imported total, and browser access before changing the local frontend connection. It then writes the public API address to `.env.development.local` automatically while retaining the previous Supabase configuration for rollback.

If publication succeeds but the verification needs another attempt, use the address already printed by Cloudflare:

```bash
npm run hearts:setup -- deploy --url https://gbppimentel-portfolio-hearts.YOUR-SUBDOMAIN.workers.dev
```

With `--url`, this command verifies and activates that deployment instead of publishing another version. Do not type an API token or secret into this command.

## 6. Test locally, then update GitHub Pages

Restart your normal development server:

```bash
npm run dev
```

The portfolio now uses the deployed Cloudflare counter. Open the site, confirm the imported total, and check that a heart change survives a refresh. A returning browser that previously gave a heart should still show its existing state.

For the live site:

1. Open the portfolio repository on GitHub.
2. Go to **Settings → Secrets and variables → Actions → Variables**.
3. Create or edit the repository variable named **`VITE_HEARTS_API_URL`**.
4. Set its value to the verified production `https://...workers.dev` address printed by the setup helper. This URL is public; it is a repository variable, not a secret.
5. Push this complete update to the repository's default branch. The existing GitHub Pages workflow builds and publishes it automatically.
6. If this update was already pushed before you added the variable, open the latest Pages workflow under **Actions** and choose **Re-run all jobs**.
7. Open the actual GitHub Pages URL, refresh it, and verify the total and your browser's heart state again. Test an add/remove and refresh once. The total may then legitimately differ from the original export because of that test or new visitors.

You can check the database and published API with:

```bash
npm run hearts:setup -- status
```

The helper's initial import verification is the migration checkpoint. After the new site is live, ordinary likes and removals can change the count from that checkpoint.

## 7. Free the Supabase slot and resume Salt & Light

After the **live GitHub Pages site** has passed the checks above:

1. Open the old **gbppimentel-dev portfolio** Supabase project.
2. Use its project settings to **Pause project**. Keep it paused as a backup; deletion is not necessary.
3. Open the existing **Salt & Light** Supabase project and choose **Resume project**.
4. Wait for it to finish resuming, then open Salt & Light's live site and test sign-in and its main features.

LifeCity stays on its existing project. Salt & Light's users and database stay on their original project; this move does not require changing Salt & Light's application configuration.

## Optional: isolated local heart testing

Use this when you want test likes that do not affect the real shared count:

```bash
npm run hearts:setup -- local
npm run hearts:dev
```

Keep that terminal running. Open a second terminal in the portfolio folder and run:

```bash
npm run dev
```

The helper initializes a separate local D1 database and updates the local frontend URL. Its data is kept under the ignored `.wrangler` folder and is not the deployed database.

On **Codespaces**, make port **8787 Public** in the **Ports** panel so the browser can call the anonymous development API. The helper automatically uses the forwarded HTTPS API address and adds this Codespace's frontend origins on ports 5173 and 4173. Keep the Vite frontend on one of those ports, or add the actual HTTPS frontend origin with the origin command below.

To return local development to the verified deployed counter:

```bash
npm run hearts:setup -- remote
```

Restart `npm run dev` after changing endpoints. If you have not completed deployment yet and want the original local Supabase connection back, use:

```bash
npm run hearts:setup -- supabase
```

That command changes only the local frontend override. It does not unfreeze, pause, or resume a Supabase project.

## Extra preview domains and rollback

The deployed Worker permits the portfolio's GitHub Pages origin and local development. For another preview/custom domain, add its complete HTTPS **origin**, without a page path:

```bash
npm run hearts:setup -- origin https://YOUR-PREVIEW-DOMAIN
```

Publish the updated Worker configuration with:

```bash
npm --prefix cloudflare/hearts run deploy
```

This republishes the API while retaining the database. A new Codespace has a different origin, so repeat the origin setup or run `init` there before redeploying. Do not place Cloudflare tokens in `VITE_` variables or browser code.

If you stop the migration **before pausing the old Supabase project**, run the complete `supabase/unfreeze-portfolio-hearts.sql` file in that original portfolio project's SQL Editor. Remove or empty the GitHub `VITE_HEARTS_API_URL` variable, rerun the Pages deployment, and use `npm run hearts:setup -- supabase` locally. This returns the previous Supabase counter; retain the Cloudflare database and CSV while you review the move.

The private export, generated SQL, and migration manifest must remain outside public assets and out of commits. The provided `.gitignore` rules cover `cloudflare/hearts/.migration/` and `.wrangler/`.

<!-- END OF FILE: HEARTS-CLOUDFLARE-R5 | heart-counter-migration.md -->
