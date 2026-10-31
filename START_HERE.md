# James Brown The Musical — Source Package

Exported October 31, 2026 from the source of saved website version 6.

Source commit: `0998803f616c8f104560d897d70680cda979a8f4`

## What is included

All 152 tracked project files are included unchanged, plus this setup guide:

- Landing page, World Premiere: Atlanta / National Tour / Broadway highlights, navigation and footer.
- Contact and more-information signup forms with their server handlers.
- Audition submission form, protected reviewer page, file-upload handling and validation.
- Creative Team page with the supplied biographies and original portraits.
- Logo, cover artwork, styles and reusable interface components.
- Database schema and migrations, dependency lockfile, build scripts and project configuration.
- Existing README, source reference HTML and design-preview documentation.

This is the editable application source. Dependencies, generated builds, Git history, local runtime state, credentials and submitted visitor data are not part of the source export. Downloaded audition materials and production database contents remain in the hosted application's storage.

## Start here

Read `README.md` for the feature overview and the existing storage and access design.

The project uses React, TypeScript, Vinext/Vite and Cloudflare Workers-compatible services. Its package configuration requires **Node.js 22.13.0 or newer**, with npm available. The lockfile fixes the dependency versions for this source snapshot.

Extract the ZIP, open a terminal in the `james-brown-the-musical` folder, and install dependencies:

```sh
npm run install:ci
```

### Run a local build with working form storage

Build the application:

```sh
npm run build
```

For a **new local database only**, apply both included SQL migrations in order. These commands use local storage; they do not copy or change the live website's data. Apply each file once for that local database:

```sh
npx wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_stale_wallflower.sql
npx wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_young_luminals.sql
```

Start the locally built application and open the address printed in the terminal:

```sh
npm start
```

For active editing with hot reload, use:

```sh
npm run dev
```

The development script defaults to port 5173. Local database and upload state are created on your machine. The default development preview uses a mock visitor, so it does not sign you in as the owner or grant audition reviewer access. Local builds do not emulate Sites sign-in routes. A local preview does not provide access to the live submission database.

## Hosting and handoff

The current website uses a D1 database binding named `DB`, private R2 file storage named `BUCKET`, and trusted Sites authentication for audition reviewers. Existing migration files are already applied to the hosted project and must remain unchanged.

Use the Sites workflow when updating the existing hosted website. If a developer moves the application to another host, they must configure equivalent database, private file storage and trusted authentication, and adapt deployment configuration as required. The trusted authentication layer must protect identity headers from visitor spoofing; accepting public request headers directly is insufficient. Uploading these source files to a basic static-file host alone does not run the submission backend.

Email notifications and automatic marketing campaigns are not configured in this version. The included README explains how the current signup, contact and audition records are stored and reviewed.

This export adds only this `START_HERE.md`; the website source and live deployment were not changed to create the ZIP.
