# Movianx Demo — Deployment Guide
## Vercel + Namecheap DNS → demo.movianx.com

---

## Step 1: Push to GitHub

```bash
# Create a new repo on GitHub called "movianx-demo"
# Then in this project folder:

cd movianx-demo
git init
git add .
git commit -m "Movianx demo v0.7 — investor demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/movianx-demo.git
git push -u origin main
```

---

## Step 2: Deploy on Vercel

1. Go to **https://vercel.com** → Sign in with GitHub
2. Click **"Add New Project"**
3. Select your **movianx-demo** repository
4. Vercel auto-detects Next.js — leave all settings as default
5. Click **"Deploy"**
6. Wait ~60 seconds. You'll get a URL like `movianx-demo-abc123.vercel.app`
7. **Test it** — make sure everything works

---

## Step 3: Add Custom Domain on Vercel

1. In your Vercel dashboard → click on the **movianx-demo** project
2. Go to **Settings → Domains**
3. Type: `demo.movianx.com`
4. Click **Add**
5. Vercel will show you the DNS records you need. It will be one of:
   - **CNAME record**: `demo` → `cname.vercel-dns.com`
   - OR an **A record**: `76.76.21.21`

**Copy these values** — you'll need them in Step 4.

---

## Step 4: Configure Namecheap DNS

1. Log in to **https://namecheap.com**
2. Go to **Domain List** → click **Manage** next to `movianx.com`
3. Click the **Advanced DNS** tab
4. Click **Add New Record** and add:

### Option A: CNAME (Recommended)
| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | demo | cname.vercel-dns.com | Automatic |

### Option B: A Record (if CNAME doesn't work)
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | demo | 76.76.21.21 | Automatic |

5. **Delete** any existing records for `demo` that might conflict
6. Click the **green checkmark** to save

---

## Step 5: Verify & SSL

1. Go back to **Vercel → Settings → Domains**
2. Wait 1-5 minutes for DNS to propagate
3. Vercel will show a **green checkmark** when verified
4. **SSL certificate** is auto-provisioned by Vercel (free, via Let's Encrypt)
5. Visit **https://demo.movianx.com** — it should be live!

### If DNS isn't propagating:
- Wait up to 48 hours (usually takes 5-30 minutes)
- Check propagation at https://dnschecker.org/#CNAME/demo.movianx.com
- Make sure there are no conflicting records in Namecheap

---

## Step 6: Auto-Deploy (Already Set Up)

Every time you push to `main` on GitHub, Vercel automatically rebuilds and deploys. The workflow is:

```bash
# Make changes to the code
git add .
git commit -m "update: improved page turn animation"
git push origin main
# → Vercel auto-deploys in ~30 seconds
```

---

## Project Structure

```
movianx-demo/
├── public/               # Static assets (future: audio files, images)
├── src/
│   └── app/
│       ├── globals.css   # CSS reset
│       ├── layout.js     # Root layout + SEO metadata
│       ├── page.js       # Home page (imports Movianx)
│       └── Movianx.js    # Full platform component
├── .gitignore
├── next.config.js
├── package.json
├── vercel.json           # Vercel deploy config
└── DEPLOY.md             # This file
```

---

## Quick Reference

| What | Where |
|------|-------|
| Live demo | https://demo.movianx.com |
| Vercel dashboard | https://vercel.com/dashboard |
| GitHub repo | https://github.com/YOUR_USERNAME/movianx-demo |
| Namecheap DNS | https://namecheap.com → Advanced DNS |
| SSL | Auto-managed by Vercel |
| Deploy | `git push origin main` |

---

## Costs

| Service | Cost |
|---------|------|
| Vercel Hobby | **Free** (100GB bandwidth, perfect for demo) |
| Namecheap domain | Already owned |
| SSL | Free (Vercel/Let's Encrypt) |
| GitHub | Free |
| **Total** | **$0/month** |

---

## Optional: Root Domain (movianx.com)

If you also want `movianx.com` (without "demo") to work:

1. In Vercel, add `movianx.com` as a domain
2. In Namecheap, add an A record:
   | Type | Host | Value |
   |------|------|-------|
   | A Record | @ | 76.76.21.21 |
3. Add a redirect from `www.movianx.com` → `movianx.com`:
   | Type | Host | Value |
   |------|------|-------|
   | CNAME | www | cname.vercel-dns.com |

---

## Troubleshooting

**"Build failed" on Vercel:**
- Check the build logs in Vercel dashboard
- Make sure `package.json` has all dependencies
- Run `npm install && npm run build` locally first

**Domain not working:**
- Check DNS propagation: https://dnschecker.org
- Make sure no conflicting DNS records exist
- Wait up to 30 minutes

**SSL not working:**
- Vercel handles this automatically
- If stuck, remove the domain and re-add it in Vercel settings
