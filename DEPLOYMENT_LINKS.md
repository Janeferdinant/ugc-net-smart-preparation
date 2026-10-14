# UGC NET Smart Preparation Portal — Local Deployment Links & Access Guide

**Brand:** Jane Rose | Asst. Professor | CSE  
**Local Server Status:** **Active & Listening on 0.0.0.0:8000**  
**Last Verified:** 2026-10-14  

---

## 1. Quick Access Links

| Environment | Access Link | Description |
|:---|:---|:---|
| **Local Machine (PC)** | [http://localhost:8000/](http://localhost:8000/) or [http://127.0.0.1:8000/](http://127.0.0.1:8000/) | Primary local access in any browser |
| **Local Network (LAN / Wi-Fi)** | [http://172.16.0.105:8000/](http://172.16.0.105:8000/) | Access from any smartphone, tablet, or laptop connected to the same Wi-Fi |
| **REST API Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | Diagnostic health verification endpoint |
| **API Subjects Endpoint** | [http://localhost:8000/api/subjects](http://localhost:8000/api/subjects) | Curricula & subject metadata |
| **Mock Tests API Endpoint** | [http://localhost:8000/api/mock-tests](http://localhost:8000/api/mock-tests) | Full mock exam catalog including 3-Hour Grand Mock |
| **Verification Report API** | [http://localhost:8000/api/verification-report](http://localhost:8000/api/verification-report) | NTA/UGC official resource verification report |

---

## 2. One-Click Launch Shortcuts

The following shortcut files have been generated in your workspace:

1. **[Open_UGC_NET_Portal.url](file:///c:/Users/Asus/Documents/Antigravity-Projects/Open_UGC_NET_Portal.url)** (Root Workspace)  
   *Double-click to open `http://localhost:8000/` instantly in your default web browser.*
2. **[Open_Local_Portal.url](file:///c:/Users/Asus/Documents/Antigravity-Projects/ugc-net-preparation/Open_Local_Portal.url)** (`ugc-net-preparation/`)  
   *Project-level internet shortcut to launch the portal.*
3. **[Launch_Local_Portal.bat](file:///c:/Users/Asus/Documents/Antigravity-Projects/ugc-net-preparation/Launch_Local_Portal.bat)** (`ugc-net-preparation/`)  
   *Automated batch script: verifies the Python server is running (starts it automatically if needed) and opens the portal in your browser.*

---

## 3. Accessing from Mobile Phones / Other Devices (Same Wi-Fi)

To test or use the portal on your phone or tablet:
1. Ensure your phone is connected to the same Wi-Fi network as this PC.
2. Open your mobile browser (Chrome, Safari, Firefox).
3. Navigate to:  
   ```
   http://172.16.0.105:8000/
   ```

---

## 4. Need a Public Internet Link (Tunneling)?

If you want to share the local deployment with external users or test outside your local Wi-Fi, you can launch a temporary HTTPS tunnel by running either of the following commands in PowerShell:

### Option A: Using SSH (No installation required)
```powershell
ssh -p 443 -R0:localhost:8000 -L4300:localhost:4300 a.pinggy.io
```
*(This outputs an instant public `https://....pinggy.link` URL.)*

### Option B: Using Cloudflare Tunnel (if installed)
```powershell
cloudflared tunnel --url http://localhost:8000
```
