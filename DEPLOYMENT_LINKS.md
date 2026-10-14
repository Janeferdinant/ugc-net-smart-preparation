# UGC NET Smart Preparation Portal — Deployment Links & Access Guide

**Brand:** Jane Rose | Asst. Professor | CSE  
**Governing Authorities:** National Testing Agency (NTA) & University Grants Commission (UGC)  
**Last Verified:** 2026-10-14  

---

## 1. Production Vercel Deployment Links

The UGC NET Smart Preparation Portal has been deployed to **Vercel** with full Edge routing and pre-rendered high-performance API endpoints:

| Service | Link | Description |
|:---|:---|:---|
| **Vercel Production URL** | [https://ugc-net-preparation.vercel.app](https://ugc-net-preparation.vercel.app) | Primary global live production domain |
| **Vercel Direct Deployment** | [https://ugc-net-preparation-dc3upetjp-janes-projects-1909f5b1.vercel.app](https://ugc-net-preparation-dc3upetjp-janes-projects-1909f5b1.vercel.app) | Immutable release deployment URL |
| **Vercel Dashboard Inspection** | [https://vercel.com/janes-projects-1909f5b1/ugc-net-preparation/4VduJgLaE63MqZuMSwksnccGQsfA](https://vercel.com/janes-projects-1909f5b1/ugc-net-preparation/4VduJgLaE63MqZuMSwksnccGQsfA) | Build logs, analytics, and project settings |

---

## 2. Local Deployment Links (Active & Verified)

The local Python server is active and serving traffic on port 8000:

| Environment | Access Link | Description |
|:---|:---|:---|
| **Local Machine (PC)** | [http://localhost:8000/](http://localhost:8000/) or [http://127.0.0.1:8000/](http://127.0.0.1:8000/) | Zero-latency local access in any browser |
| **Local Network (LAN / Wi-Fi)** | [http://172.16.0.105:8000/](http://172.16.0.105:8000/) | Access from any phone or tablet on the same Wi-Fi |
| **REST API Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | Diagnostic health verification endpoint |
| **API Subjects Endpoint** | [http://localhost:8000/api/subjects](http://localhost:8000/api/subjects) | Curricula & subject metadata |
| **Mock Tests API Endpoint** | [http://localhost:8000/api/mock-tests](http://localhost:8000/api/mock-tests) | Mock exam catalog including 3-Hour Grand Mock |
| **Verification Report API** | [http://localhost:8000/api/verification-report](http://localhost:8000/api/verification-report) | NTA/UGC official resource verification report |

---

## 3. Git & Windows Credential Manager Deployment

Git is configured with Windows Credential Manager (`wincred` and `manager`) for the account **Janeferdinant** (`janeferdinant@gmail.com`).

Stored targets:
- `git:https://github.com`
- `git:https://Janeferdinant@github.com`
- `Vercel`

### Push & Synchronize Commands
To push the committed codebase to your GitHub repository and trigger automatic Vercel updates:

```powershell
cd c:\Users\Asus\Documents\Antigravity-Projects\ugc-net-preparation

# Link remote repository (if not already linked)
git remote add origin https://github.com/Janeferdinant/ugc-net-preparation.git

# Push main branch (Windows Credential Manager automatically authenticates)
git push -u origin main
```

### Direct Vercel CLI Updates
If deploying directly without Git:
```powershell
npx --yes vercel --prod
```

---

## 4. One-Click Desktop Shortcuts

1. **[Open_UGC_NET_Portal.url](file:///c:/Users/Asus/Documents/Antigravity-Projects/Open_UGC_NET_Portal.url)** (Root Workspace)  
   *Double-click to open `http://localhost:8000/` instantly.*
2. **[Launch_Local_Portal.bat](file:///c:/Users/Asus/Documents/Antigravity-Projects/ugc-net-preparation/Launch_Local_Portal.bat)** (`ugc-net-preparation/`)  
   *Batch launcher that checks Python background server status and opens the portal.*
3. **[README.md](file:///c:/Users/Asus/Documents/Antigravity-Projects/ugc-net-preparation/README.md)**  
   *Interactive documentation featuring embedded animated showcase videos.*
