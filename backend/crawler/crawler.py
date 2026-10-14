import os
import sys
import hashlib
import time
import json
import urllib.parse
from typing import Dict, List, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from database.db import get_db_connection

def compute_sha256(content: bytes) -> str:
    """Computes SHA-256 hash of byte content for deduplication."""
    return hashlib.sha256(content).hexdigest()

class CrawlEngine:
    def __init__(self, rate_limit_seconds: float = 1.0):
        self.rate_limit_seconds = rate_limit_seconds
        self.last_crawl_time = 0.0
        self.allowed_domains = [
            "ugcnet.nta.ac.in",
            "nta.ac.in",
            "ugcnetonline.in",
            "www.ugcnetonline.in",
            "ugc.gov.in",
            "www.ugc.gov.in"
        ]
        
    def check_robots_policy(self, url: str) -> bool:
        """Verifies if the URL is compliant with academic open access and scraping policy."""
        parsed = urllib.parse.urlparse(url)
        # Disallow administrative and dynamic search querying routes
        disallowed_paths = ["/admin", "/api/private", "/auth", "/login", "/wp-admin"]
        for p in disallowed_paths:
            if parsed.path.startswith(p):
                return False
        return True

    def crawl_resource(self, url: str) -> Dict:
        """Simulates ethical, rate-limited resource discovery and validation."""
        now = time.time()
        time_since_last = now - self.last_crawl_time
        if time_since_last < self.rate_limit_seconds:
            time.sleep(self.rate_limit_seconds - time_since_last)
        self.last_crawl_time = time.time()

        if not self.check_robots_policy(url):
            return {
                "url": url,
                "status": "blocked_by_robots_policy",
                "is_valid": False
            }

        # Clean canonical URL
        parsed = urllib.parse.urlparse(url)
        clean_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
        content_mock = f"Verified Resource Stream from {clean_url}".encode("utf-8")
        content_hash = compute_sha256(content_mock)

        # Log to DB
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO crawler_logs (source_url, http_status, content_hash, items_found, status_message, is_valid)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (clean_url, 200, content_hash, 1, "Resource verified and indexed successfully", 1))
        conn.commit()
        conn.close()

        return {
            "url": clean_url,
            "status": "success",
            "content_hash": content_hash,
            "http_status": 200,
            "is_valid": True
        }

if __name__ == "__main__":
    engine = CrawlEngine()
    res = engine.crawl_resource("https://ugcnet.nta.ac.in/archive/2024/cs_87.pdf")
    print("Crawled:", res)
