# InsightForge – Quick Deployment Setup (5 Minutes)

> **tl;dr:** Deploy backend to Render, frontend to Firebase, update one URL. Done.

---

## 🚀 Ultra-Quick Start

### 1️⃣ Deploy Backend (3 min)

**Choose ONE:**

#### **Option A: Render (Easiest)**
```bash
# Go to https://render.com
# 1. Sign in with GitHub
# 2. Create new Web Service
# 3. Select InsightForge repository
# 4. Fill in:
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn api.main:app --host 0.0.0.0 --port $PORT
# 5. Deploy!
# 6. Copy the deployed URL (e.g., https://insightforge-api.onrender.com)
```

#### **Option B: Railway**
```bash
# Go to https://railway.app
# 1. Sign in with GitHub
# 2. New Project → Import GitHub Repo
# 3. Select InsightForge
# 4. Railway auto-detects python and deploys
# 5. Copy the deployed URL
```

---

### 2️⃣ Deploy Frontend (2 min)

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Deploy to Firebase Hosting
cd /Users/prabhnoorsingh/Desktop/InsightForge
firebase deploy --only hosting

# 4. Copy your Firebase URL from the output
# Example: https://insightforge.web.app
```

---

### 3️⃣ Connect Them (30 sec)

**Update** `webapp/config.js`:

```javascript
// Change this line:
const apiBaseUrl = isDevelopment 
  ? "http://127.0.0.1:8000"
  : "https://insightforge-api.onrender.com";  // ← YOUR RENDER URL HERE
```

**Redeploy frontend:**
```bash
firebase deploy --only hosting
```

---

### 4️⃣ Test

Open your Firebase URL:
```
https://insightforge.web.app
```

Click "Load demo values" → Run Analysis

✅ **Done!**

---

## 📝 Environment Variables (Backend)

Set these in your Render/Railway dashboard:

```
ECOM_AGENT_CORS_ORIGINS=https://insightforge.web.app,https://insightforge.firebaseapp.com
PYTHONUNBUFFERED=true
```

---

## 🎯 What You Get

| Component | Where | URL |
|-----------|-------|-----|
| Frontend | Firebase Hosting | `https://insightforge.web.app` |
| API | Render / Railway | `https://insightforge-api.onrender.com` |
| Docs | GitHub | `https://github.com/[you]/InsightForge` |

---

## ❓ Stuck?

**Firebase Deploy Error:**
```bash
firebase init hosting  # Run this first
# Choose: webapp as public directory
# Choose: YES for single-page app
# Choose: NO for GitHub auto-deploy (for now)
```

**Backend not responding:**
- Check Render/Railway logs (dashboard → Logs tab)
- Verify CORS_ORIGINS environment variable is set
- Restart the service

**Frontend says API error:**
- Check `webapp/config.js` has correct backend URL
- Click to the backend `/docs` endpoint to test API directly
- Check browser console (F12 → Console) for errors

---

## 🔄 Update Your Code Later

1. Push to GitHub
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. Both services auto-redeploy (if CI/CD is enabled)

3. If not auto-deploying:
   - **Render:** Manually trigger redeploy in dashboard
   - **Firebase:** Run `firebase deploy --only hosting`

---

## 💡 Pro Tips

- Use Firebase's free tier for unlimited hosting
- Render free tier sleeps after 15 min inactivity (just restarts on request)
- To prevent sleep: Render's "Keep Alive" (paid feature)
- Want higher availability? Use Railway ($5/month) instead

---

## 🏆 Success Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Firebase
- [ ] `webapp/config.js` points to correct backend URL
- [ ] Firebase website loads without errors
- [ ] "Load demo values" works
- [ ] Analysis completes and shows results
- [ ] Share the Firebase URL with others!

---

**You're live! 🎉**
