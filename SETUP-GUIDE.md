# ASEI Website: Step-by-Step Setup Guide

This guide takes you from this folder to a live website. Follow the parts in order.
Each part ends with a **Check** so you know it worked before you move on.

You need about 2 to 3 hours the first time. All services used have free plans.
Free plans change over time, so check each service's current limits before launch.

**Words used in this guide**

- **Terminal**: the program where you type commands. Windows: "PowerShell" or "Terminal". Mac: "Terminal".
- **Project folder**: the `asei-website` folder from the zip file.
- **Run a command**: type it in the terminal, inside the project folder, and press Enter.

---

## Part 1. Install the tools (one time only)

1. **Node.js**: go to https://nodejs.org, download the **LTS** version, and install it.
2. **Git**: go to https://git-scm.com/downloads, download and install it. Keep the default options.
3. **A code editor** (recommended): Visual Studio Code from https://code.visualstudio.com

Open a new terminal and run:

```
node -v
git --version
```

**Check:** you see version numbers, for example `v22.x.x` and `git version 2.x`.
Node must be version 20 or newer.

---

## Part 2. Run the website on your computer

1. Unzip `asei-website.zip`. Put the folder somewhere easy, like `Documents`.
2. Open the terminal **inside** that folder.
   - VS Code: File > Open Folder > choose `asei-website`, then Terminal > New Terminal.
3. Run these commands one at a time:

```
npm install
```

   Windows (PowerShell):
```
copy .env.example .env.local
```
   Mac or Linux:
```
cp .env.example .env.local
```

```
npm run dev
```

4. Open http://localhost:3000 in your browser.

**Check:** the ASEI homepage appears with the six programs.
The forms will say they are not connected yet. That is expected until Part 4.

To stop the website, click the terminal and press `Ctrl + C`.

---

## Part 3. Create the database (Supabase)

### 3.1 Create the project

1. Go to https://supabase.com and sign up (you can use your GitHub account after Part 7, or email).
2. Click **New project**.
   - **Name:** `asei-website`
   - **Database password:** click "Generate a password" and **save it in a safe place**.
   - **Region:** choose the one closest to your visitors. For Ethiopia, a European region
     (for example Frankfurt) is usually a good choice.
3. Click **Create new project** and wait 1 to 2 minutes.

### 3.2 Create the tables and security rules

The `supabase` folder has four files. Run the first three now, **in this order**.

For each file:

1. In Supabase, open **SQL Editor** (left menu) and click **New query**.
2. Open the file in your code editor, select all the text (`Ctrl + A`), and copy it.
3. Paste it into the Supabase query box and click **Run**.
4. You should see "Success. No rows returned".

| Order | File | What it does |
|---|---|---|
| 1 | `01_schema.sql` | Creates all the tables |
| 2 | `02_security.sql` | Turns on Row Level Security, roles and file storage rules |
| 3 | `03_starter_content.sql` | Adds the six programs, settings and impact figures (all zero) |

**Check:** open **Table Editor**. You see tables such as `programs`, `projects` and `inquiries`,
and `programs` has 6 rows. Open **Storage**: you see two buckets, `media` and `documents`.

If a file shows an error, do not run the next file. See "Troubleshooting" at the end.

### 3.3 Turn off public sign-up

Visitors must never be able to create accounts.

1. Go to **Authentication** > **Sign In / Providers** (in some versions: **Settings**).
2. Turn **off** "Allow new users to sign up".
3. Click **Save**.

**Check:** the setting shows as off.

---

## Part 4. Connect the website to the database

1. In Supabase, open **Project Settings** > **API Keys** (or click **Connect** at the top).
2. Find these three values:
   - **Project URL**, like `https://abcdefgh.supabase.co`
   - **Public key**: called `anon` `public`, or **publishable key** (starts with `sb_publishable_`)
   - **Secret key**: called `service_role`, or **secret key** (starts with `sb_secret_`)
3. Open `.env.local` in your project folder and fill them in:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-or-secret-key
```

4. Save the file. In the terminal press `Ctrl + C`, then run `npm run dev` again.

> **Keep the secret key secret.** Never send it by email or chat, never put it in a screenshot,
> and never put it in GitHub. The `.gitignore` file already stops `.env.local` from being uploaded.

**Check:** go to http://localhost:3000/contact, fill in the form, and send it.
You see "Thank you. Your message has been sent". In Supabase **Table Editor** > `inquiries`,
your message is there.

---

## Part 5. Create the first administrator

1. In Supabase go to **Authentication** > **Users** > **Add user** > **Create new user**.
2. Enter your email and a strong password (at least 12 characters). Tick **Auto Confirm User**.
   Click **Create user**.
3. Open **SQL Editor** > **New query**, and paste the contents of `supabase/04_first_admin.sql`.
4. Replace `YOUR FULL NAME` and `YOUR-EMAIL@example.org` with your details (keep the quotes).
5. Click **Run**.

**Check:** the result shows one row with role `super_admin`.
Now open http://localhost:3000/admin/login and log in. You see the dashboard.

### Adding more staff later

Log in as super admin and open **Users**. Enter their name, email, role and a temporary
password. Share the password privately. They should change it with **Change password**.

| Role | Can do |
|---|---|
| Super Admin | Everything: users, settings, all content, inquiries, volunteers, subscribers |
| Editor | Programs, news, publications, partners, media |
| Project Manager | Projects, media, and partnership or project inquiries |

---

## Part 6. Add your content and test everything

### 6.1 Update the basics

In the admin area:

1. **Settings**: add the official email, telephone, address and social media links.
2. **Programs**: check the six programs, and add photos if you have them.
3. **Projects**: add real projects with the correct status. Start as **Draft**, publish when approved.

In the code (then save; the site reloads by itself):

- `src/components/HeroIllustration.tsx`: replace the drawing with a real photo when you have one
  (see the note at the top of that file).
- `src/app/(site)/vision-mission/page.tsx`: confirm the vision and mission wording.
- `src/app/(site)/privacy-policy/page.tsx` and `terms/page.tsx`: have them reviewed, and add the date.

### 6.2 Test checklist

Tick each item. These match section 25 of the specification.

- [ ] Homepage and menu links all open the right pages
- [ ] Every public page loads (About, Vision and Mission, Programs, Projects, Research,
      Publications, News, Partners, Get Involved, Contact, Privacy Policy, Terms)
- [ ] Contact form: send a message, then find it in **Admin > Inquiries**
- [ ] Contact form: send it empty and see clear error messages
- [ ] Partnership form (Partners page): send one, find it in **Inquiries** with type "partnership"
- [ ] Volunteer form (Get Involved page): send one, see the confirmation, find it in **Volunteers**
- [ ] Newsletter: subscribe, then subscribe again with the same email: "already subscribed"
- [ ] Newsletter: open `/unsubscribe?token=...` using the link from **Subscribers > Export**, and unsubscribe
- [ ] Admin: log in, log out, and log in with a wrong password (you see an error)
- [ ] Roles: create an Editor account. Log in as the Editor: no Projects, Users or Settings in the menu
- [ ] Projects: create, edit, publish, unpublish and delete a test project
- [ ] News: create a draft article (not visible on /news), publish it (visible)
- [ ] Publications: upload a PDF and download it from /publications
- [ ] Images: upload a JPG photo to a program; try a file that is not an image (it is refused)
- [ ] Phone and tablet: open the site on your phone (after Part 8) and use the menu
- [ ] Security: open http://localhost:3000/admin/dashboard in a private browser window:
      you are sent to the login page
- [ ] Empty states: before adding news, /news shows "News is on its way"

---

## Part 7. Put the code on GitHub

1. Create a free account at https://github.com
2. Click **+** (top right) > **New repository**.
   - **Name:** `asei-website`
   - Choose **Private**.
   - Do **not** add a README or .gitignore (the project already has them).
   - Click **Create repository**.
3. In your terminal, inside the project folder, run these commands one at a time.
   Replace `YOUR-USERNAME` with your GitHub username.

```
git init
git add .
git commit -m "ASEI website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/asei-website.git
git push -u origin main
```

The first time, Git asks you to log in to GitHub. Follow the steps in the window that opens.

**Check:** refresh the GitHub page. You see your files. Make sure `.env.local` is **not** in the list.

---

## Part 8. Publish the website (Vercel)

1. Go to https://vercel.com and choose **Sign up with GitHub**.
2. Click **Add New** > **Project**, find `asei-website`, and click **Import**.
3. Open **Environment Variables** and add each one (name and value), using the same values as `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`: for now type `https://asei-website.vercel.app`
     (you will correct it in step 5)
   - Email settings from Part 9, if you use them
4. Click **Deploy** and wait 2 to 3 minutes.
5. When it finishes, copy your real address (for example `https://asei-website-abc.vercel.app`).
   Go to **Settings** > **Environment Variables**, edit `NEXT_PUBLIC_SITE_URL` to that address,
   then go to **Deployments**, click the three dots on the latest one, and choose **Redeploy**.
6. In Supabase: **Authentication** > **URL Configuration**. Set **Site URL** to your Vercel address. Save.

**Check:** open your Vercel address on your computer **and on your phone**. Log in at `/admin/login`.
Send a test message through the contact form.

**From now on:** every time you `git push` changes to GitHub, Vercel updates the live website by itself.

```
git add .
git commit -m "Describe your change"
git push
```

---

## Part 9. Email notifications (optional)

Without this, everything still works: form submissions are saved and shown in the admin.
With it, your team gets an email for each new submission, volunteers get a confirmation email,
and new subscribers get a welcome email with an unsubscribe link.

1. Create an account at https://resend.com
2. **Domains** > **Add domain**: add your organization's domain and follow the steps to verify it.
   (You need your own domain for this. See Part 10.)
3. **API Keys** > **Create API key**. Copy it.
4. Add these to `.env.local` and to Vercel's Environment Variables:

```
RESEND_API_KEY=re_your_key
EMAIL_FROM=ASEI <info@your-domain.org>
ADMIN_NOTIFY_EMAIL=your-team-inbox@your-domain.org
```

5. On Vercel, redeploy (as in Part 8, step 5).

**Check:** send a contact form. The team inbox receives an email.

---

## Part 10. Connect your own domain (when you have one)

1. Buy a domain, for example `asei.org` or a `.et` domain from Ethio Telecom.
2. In Vercel: your project > **Settings** > **Domains** > type your domain > **Add**.
3. Vercel shows one or two DNS records. Add them at the company where you bought the domain.
4. Wait until Vercel shows a green tick (from minutes up to 48 hours).
5. Change `NEXT_PUBLIC_SITE_URL` in Vercel to `https://your-domain`, and redeploy.
6. In Supabase **Authentication** > **URL Configuration**, change **Site URL** to the new address.

---

## Part 11. Keep it safe and running

- **Backups:** the Supabase free plan does not give you downloadable daily backups.
  Choose one:
  - Upgrade to the Supabase Pro plan, which includes daily backups, or
  - Make a backup yourself every week: Supabase > **Database** > **Backups** (if shown), or use
    the Supabase CLI command `supabase db dump`. Store the file somewhere safe.
- **Free projects pause:** Supabase may pause free projects that have no activity for a week.
  Visit the admin area regularly, or upgrade when the site is in real use.
- **Passwords:** every administrator should use a strong, unique password.
  Remove staff accounts as soon as someone leaves (Admin > Users > Remove).
- **Security keys:** if the secret key is ever shared by mistake, open Supabase > Project Settings >
  API Keys, create a new secret key, delete the old one, and update `.env.local` and Vercel.
- **Errors:** Vercel > your project > **Logs** shows server errors. Supabase > **Logs** shows database errors.

---

## Troubleshooting

| Problem | What to do |
|---|---|
| `npm` is not recognized | Close and reopen the terminal after installing Node.js. Restart the computer if needed. |
| SQL error "already exists" | You ran a file twice. Easiest fix on a new project: Supabase > Project Settings > General > delete the project, create a new one, and run the files once each. |
| Forms say "not connected yet" | `.env.local` is missing a value, or you did not restart `npm run dev`. On Vercel: check Environment Variables, then redeploy. |
| Forms say "could not be saved" | Check that you ran all three SQL files, and that `SUPABASE_SERVICE_ROLE_KEY` is the secret key, not the public one. |
| Login says the email or password is not correct | Check the user exists in Supabase > Authentication > Users and is confirmed. |
| Login says "does not have administrator access" | The account has no profile. Run `04_first_admin.sql` with that email, or add the person from Admin > Users. |
| Image upload refused | Only JPG, PNG or WebP up to 5 MB, and PDF up to 20 MB. |
| Changes in the admin do not appear on the site | Refresh the page. Public pages update straight after saving, and at least every 5 minutes. |
| "Too many submissions" when testing | The spam limit is 5 per hour per form from one network. Wait an hour, or in Supabase delete rows from `form_rate_limits`. |
