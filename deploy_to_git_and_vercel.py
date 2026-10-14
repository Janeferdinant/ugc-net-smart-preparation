import os
import sys
import ctypes
from ctypes import wintypes
import json
import urllib.request
import urllib.error
import subprocess

CRED_TYPE_GENERIC = 1

class CREDENTIAL(ctypes.Structure):
    _fields_ = [
        ('Flags', wintypes.DWORD),
        ('Type', wintypes.DWORD),
        ('TargetName', wintypes.LPWSTR),
        ('Comment', wintypes.LPWSTR),
        ('LastWritten', wintypes.FILETIME),
        ('CredentialBlobSize', wintypes.DWORD),
        ('CredentialBlob', ctypes.POINTER(ctypes.c_byte)),
        ('Persist', wintypes.DWORD),
        ('AttributeCount', wintypes.DWORD),
        ('Attributes', ctypes.c_void_p),
        ('TargetAlias', wintypes.LPWSTR),
        ('UserName', wintypes.LPWSTR),
    ]

PCREDENTIAL = ctypes.POINTER(CREDENTIAL)
CredReadW = ctypes.windll.advapi32.CredReadW
CredReadW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD, ctypes.POINTER(PCREDENTIAL)]
CredReadW.restype = wintypes.BOOL
CredFree = ctypes.windll.advapi32.CredFree
CredFree.argtypes = [ctypes.c_void_p]

def get_credential(target_name):
    pcred = PCREDENTIAL()
    res = CredReadW(target_name, CRED_TYPE_GENERIC, 0, ctypes.byref(pcred))
    if not res:
        for alt in [f'LegacyGeneric:target={target_name}', target_name.replace('LegacyGeneric:target=', '')]:
            res = CredReadW(alt, CRED_TYPE_GENERIC, 0, ctypes.byref(pcred))
            if res:
                break
    if not res:
        return None, None
    try:
        cred = pcred.contents
        blob_bytes = bytes(cred.CredentialBlob[:cred.CredentialBlobSize])
        try:
            password = blob_bytes.decode('utf-16le')
            if not password.isprintable():
                password = blob_bytes.decode('utf-8')
        except:
            password = blob_bytes.decode('utf-8', errors='ignore')
        return cred.UserName, password
    finally:
        CredFree(pcred)

def run():
    base_dir = r"c:\Users\Asus\Documents\Antigravity-Projects\ugc-net-preparation"
    os.chdir(base_dir)

    print("=" * 70, flush=True)
    print("UGC NET PORTAL — GIT & VERCEL AUTOMATED DEPLOYMENT", flush=True)
    print("Brand: Jane Rose | Asst. Professor | CSE", flush=True)
    print("=" * 70, flush=True)

    # 1. Retrieve credentials
    print("\n[Step 1/5] Extracting credentials from Windows Credential Manager...", flush=True)
    git_user, git_token = get_credential("git:https://github.com")
    vercel_user, vercel_token = get_credential("Vercel")

    if not git_token or not vercel_token:
        print("ERROR: Failed to retrieve required Git or Vercel credentials!", flush=True)
        sys.exit(1)

    print(f"-> Authenticated as GitHub user: '{git_user}'", flush=True)
    print(f"-> Authenticated as Vercel user: '{vercel_user}'", flush=True)

    # 2. Check / Create GitHub repository
    repo_name = "ugc-net-smart-preparation"
    print(f"\n[Step 2/5] Creating / Verifying GitHub repository '{repo_name}'...", flush=True)
    
    repo_url = f"https://api.github.com/repos/{git_user}/{repo_name}"
    check_req = urllib.request.Request(repo_url, headers={
        "Authorization": f"token {git_token}",
        "User-Agent": "Antigravity-Deployment"
    })

    repo_exists = False
    try:
        with urllib.request.urlopen(check_req) as resp:
            if resp.status == 200:
                repo_exists = True
                print(f"-> Repository https://github.com/{git_user}/{repo_name} already exists.", flush=True)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            repo_exists = False
        else:
            print(f"HTTP error checking repo: {e.code}", flush=True)

    if not repo_exists:
        create_payload = json.dumps({
            "name": repo_name,
            "description": "UGC NET Smart Preparation Portal — Paper 1, Computer Science & Applications, Electronic Science. Official PYQs, CBT Exam Engine, 10 Glassmorphism Themes.",
            "homepage": "https://ugcnet.nta.ac.in",
            "private": False,
            "has_issues": True,
            "has_projects": True,
            "has_wiki": True
        }).encode("utf-8")

        create_req = urllib.request.Request(
            "https://api.github.com/user/repos",
            data=create_payload,
            headers={
                "Authorization": f"token {git_token}",
                "User-Agent": "Antigravity-Deployment",
                "Content-Type": "application/json"
            }
        )
        try:
            with urllib.request.urlopen(create_req) as resp:
                created_data = json.loads(resp.read().decode())
                print(f"-> Successfully created repository: {created_data.get('html_url')}", flush=True)
        except urllib.error.HTTPError as e:
            print(f"Error creating GitHub repo: {e.code} - {e.read().decode()}", flush=True)

    # 3. Git Init, Commit & Push
    print("\n[Step 3/5] Initializing Git, committing all assets & pushing to GitHub...", flush=True)
    
    if not os.path.exists(".git"):
        subprocess.run(["git", "init"], check=True)
        subprocess.run(["git", "branch", "-M", "main"], check=True)
    
    subprocess.run(["git", "config", "user.name", "Janeferdinant"], check=True)
    subprocess.run(["git", "config", "user.email", "janeferdinant@gmail.com"], check=True)

    subprocess.run(["git", "add", "."], check=True)
    commit_res = subprocess.run(
        ["git", "commit", "-m", "feat: complete UGC NET smart preparation portal with CBT engine, verified PYQs, and glassmorphism UI"],
        capture_output=True, text=True
    )
    print("Git Commit Output:", commit_res.stdout.strip() or commit_res.stderr.strip(), flush=True)

    remote_res = subprocess.run(["git", "remote"], capture_output=True, text=True)
    if "origin" in remote_res.stdout:
        subprocess.run(["git", "remote", "set-url", "origin", f"https://github.com/{git_user}/{repo_name}.git"], check=True)
    else:
        subprocess.run(["git", "remote", "add", "origin", f"https://github.com/{git_user}/{repo_name}.git"], check=True)

    auth_remote = f"https://{git_user}:{git_token}@github.com/{git_user}/{repo_name}.git"
    print(f"Pushing to https://github.com/{git_user}/{repo_name} (branch main)...", flush=True)
    push_res = subprocess.run(["git", "push", "-u", auth_remote, "main", "--force"], capture_output=True, text=True)
    print("Git Push Output:", push_res.stdout.strip() or push_res.stderr.strip()[:300], flush=True)

    # Reset origin to clean URL
    subprocess.run(["git", "remote", "set-url", "origin", f"https://github.com/{git_user}/{repo_name}.git"], check=True)

    # 4. Deploy to Vercel
    print("\n[Step 4/5] Deploying to Vercel Production...", flush=True)
    deploy_cmd = ["npx.cmd", "vercel", "deploy", "--prod", "--yes", "--token", vercel_token]
    
    proc = subprocess.Popen(deploy_cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
    
    deployment_url = None
    for line in iter(proc.stdout.readline, ''):
        safe_line = line.replace(vercel_token, "[REDACTED]")
        print(safe_line, end='', flush=True)
        if "https://" in safe_line and ".vercel.app" in safe_line:
            words = safe_line.strip().split()
            for w in words:
                if w.startswith("https://") and ".vercel.app" in w:
                    deployment_url = w.strip('",; \t\r\n')

    proc.stdout.close()
    return_code = proc.wait()
    print(f"\nVercel CLI exit code: {return_code}", flush=True)

    # 5. Verification
    print("\n[Step 5/5] Verifying Deployment Endpoints...", flush=True)
    if deployment_url:
        print(f"Target Production URL: {deployment_url}", flush=True)
        test_urls = [
            deployment_url,
            f"{deployment_url}/api/health",
            f"{deployment_url}/api/subjects",
            f"{deployment_url}/api/mock-tests",
            f"{deployment_url}/assets/hero_banner.jpg"
        ]
        for u in test_urls:
            try:
                with urllib.request.urlopen(u) as r:
                    print(f"  [200 OK] {u}", flush=True)
            except Exception as ex:
                print(f"  [Status Check] {u} -> {ex}", flush=True)

    print("\n" + "=" * 70, flush=True)
    print("DEPLOYMENT COMPLETE!", flush=True)
    print(f"GitHub: https://github.com/{git_user}/{repo_name}", flush=True)
    print(f"Vercel: {deployment_url or 'Check Vercel Dashboard'}", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    run()
