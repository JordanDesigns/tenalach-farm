# Tenalach Farm website

- **Live site:** https://tenalach-farm.netlify.app (before the tenalachfarm.ca domain is moved over)
- **Dashboard:** https://tenalach-farm.netlify.app/admin/ (Login with GitHub)
- **Repository:** https://github.com/JordanDesigns/tenalach-farm. Netlify redeploys on every push, including dashboard edits.

A plain HTML/CSS/JS copy of the Square Online site at tenalachfarm.ca. There is no build step and no database. The Workshops & Events page has a small dashboard for adding and removing workshops without touching code. It can all be hosted for free.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `about-us.html` | About Us (story, values, farmer, contact form, map and hours) |
| `seedlings.html` | Seedlings, Flowers & Herbs: what's ready each season, a photo gallery, how to get plants (no online sales), and an inquiry form |
| `workshops-and-events.html` | Workshops & Events. The workshop list comes from `content/workshops.json`, which is edited in the dashboard |
| `rentals.html` | Farm Stays (Airbnb and VRBO booking links, photo galleries, reviews) |
| `admin/` | The workshops dashboard (not linked from the site) |

## Workshops dashboard

The dashboard is at **`https://tenalachfarm.ca/admin/`** once the site is live. It uses Decap CMS, which is free and open source.

### What the dashboard can do

- **Add a workshop or event:** title, Workshop or Event, date, time, location, price, spots, a main photo, extra photos, a short summary, a full description, what to bring, and an optional booking link.
- **Edit or remove** anything already listed, or switch **"Show on the website"** off to hide something without deleting it.
- **Publish:** clicking **Publish → Publish now** updates the site in about a minute.

How it shows on the site:

- Items with a date are listed soonest first. Items without one show "Date to be announced".
- Dated items **disappear automatically the day after** the date.
- With a booking link, the button says **Book Now**. Without one, it says **Inquire** and fills in the contact form on the page.
- The **View details** popup appears when there's a full description, a "what to bring" list, or extra photos.

### One-time setup (done on 2026-10-26, kept here for reference)

The dashboard saves changes into the site's files on GitHub, and the host rebuilds from there. That means the site has to be hosted from a GitHub repository, not dragged and dropped.

1. Create a GitHub repository (for example `tenalach-farm`) and push this folder to its `main` branch.
2. In `admin/config.yml`, change `repo:` to `your-github-username/tenalach-farm` and push again.
3. On **Netlify**: **Add new site → Import from Git →** pick the repository. No build command is needed; the publish directory is the repository root.
4. Create a GitHub OAuth App (GitHub → Settings → Developer settings → OAuth Apps → New):
   - Homepage URL: your site URL
   - Authorization callback URL: `https://api.netlify.com/auth/done`
5. In Netlify: **Site configuration → Access & security → OAuth → Install provider → GitHub**, and paste the OAuth App's Client ID and Secret.
6. Log in at `/admin/` with "Login with GitHub" (Jordan is the only editor; the client sends changes to Jordan).

Photos uploaded in the dashboard are saved to `assets/images/uploads/`.

### Trying the dashboard on your own computer

1. In this folder, run `npx decap-server`.
2. Serve the folder with any local web server and open `/admin/`.

"Login" then works without GitHub, and changes save straight into `content/workshops.json`.

Note: opening the HTML files by double-clicking them won't load the workshop list. Browsers block that for files opened from disk, so use a local web server or the live site.

## Editing everything else

- **Text and photos:** edit the HTML files directly. Images live in `assets/images/`. The Seedlings photos are in `assets/images/seedlings/` and the workshop photos in `assets/images/workshops/`.
- **Photo galleries:** add or remove `<img>` lines inside a gallery's `carousel__track`.
- **Colours and fonts:** they're set as variables at the top of `assets/css/style.css`.
- The header and footer are repeated in each HTML file, so a menu change has to be made in all five files.

## Forms (contact, newsletter, inquiries)

By default, sending a form opens the visitor's email app with a message addressed to tenalachfarm1@gmail.com. If you'd rather have forms send directly:

1. Create a free form at https://formspree.io and copy its endpoint (for example `https://formspree.io/f/abcdwxyz`).
2. Paste it into `formEndpoint` at the top of `assets/js/main.js`.

## Hosting

Use **Netlify connected to GitHub**, as described in the setup above. It's free, it supports a custom domain with HTTPS, and it's what the dashboard needs.

Switching from Square: publish the new site first, then add `tenalachfarm.ca` as a custom domain in Netlify and update the domain's DNS records as Netlify tells you. Cancel the Square subscription only after the new site is live on the domain. If the domain was bought through Square, transfer it to a registrar first.

The `.claude/` and `assets/provided/` folders were only used while building the site and don't need to be uploaded.
