# InsightForge – Quick Deployment Setup (5 Minutes)

> **tl;dr:** Deploy backend to Railway, frontend to Firebase, update one URL. Done.

---

## Ultra-Quick Start

### 1. Deploy Backend (3 min)

**Railway Deployment:**

```bash
# Go to https://railway.app
# 1. Sign in with GitHub
# 2. New Project → Import GitHub Repo
# 3. Select InsightForge
# 4. Railway auto-detects python and deploys
# 5. Copy the deployed URL (e.g., https://insightforge-production.up.railway.app)
```

---

### 2. Deploy Frontend (2 min)

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Deploy to Firebase Hosting
cd /Users/prabhnoorsingh/Desktop/InsightForge
firebase deploy --only hosting

# 4. Copy your Firebase URL from the output
# Example: https://insightforge-1.web.app
```

---

### 3. Connect Them (30 sec)

**Update** `webapp/config.js`:

```javascript
// Change this line to your deployed Railway URL. 
// Note: During local demo development, this is set to the Localtunnel bridge URL.
const apiBaseUrl = "https://insightforge-production.up.railway.app";
```

**Redeploy frontend:**

```bash
firebase deploy --only hosting
```

---

### 4. Test

Open your Firebase URL:

```
https://insightforge-1.web.app
```

Search for any product (e.g. "Smart Watches") and click "Generate Insights". Ensure the API Health Badge displays "🟢 API Online".

Done.

---

## Environment Variables (Backend)

Set these in your Railway dashboard:

```text
ECOM_AGENT_CORS_ORIGINS=https://insightforge-1.web.app,https://insightforge.firebaseapp.com
PYTHONUNBUFFERED=true
```

## Local Tunnel Bypass (Alternative)

If Railway deployment is unavailable, InsightForge can be served live from your local machine to the Firebase frontend securely:

1. Start the local python backend: `uvicorn api.main:app --port 8000`
2. Start the secure HTTPS tunnel: `npx localtunnel --port 8000`
3. Copy the generated `loca.lt` URL into `webapp/config.js` and redeploy Firebase.
| API | Render / Railway | `https://insightforge-api.onrender.com` |
| Docs | GitHub | `https://github.com/[you]/InsightForge` |

**Firebase Deploy Error:**

```bash
firebase init hosting  # Run this first
# Choose: webapp as public directory
# Choose: YES for single-page app
# Choose: NO for GitHub auto-deploy (for now)
```

**Backend not responding:**

- Check Railway logs (dashboard → Logs tab)
- Verify CORS_ORIGINS environment variable is set
- Restart the service

**Frontend says API error:**

- Check `webapp/config.js` has correct backend URL
- Click to the backend `/docs` endpoint to test API directly
- Check browser console (F12 → Console) for errors

---

## Update Your Code Later

1. Push to GitHub

   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. Both services auto-redeploy (if CI/CD is enabled)

3. If not auto-deploying:
   - **Railway:** Manually trigger redeploy in dashboard
   - **Firebase:** Run `firebase deploy --only hosting`

---

## Pro Tips

- Use Firebase's free tier for unlimited hosting.
- Want higher backend availability and resource stability? Rely on Railway over basic free tiers.

---

## Success Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Firebase
- [ ] `webapp/config.js` points to correct backend URL
- [ ] Firebase website loads without errors
- [ ] Live generation via the search bar completes cleanly
- [ ] Analysis completes and shows results
- [ ] Share the Firebase URL with others!

---

**You're live! 🎉**
