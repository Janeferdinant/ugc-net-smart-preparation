import os
import sys
import json
import csv
import urllib.parse
from typing import Dict, List, Any

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from database.db import get_db_connection

class LinkValidator:
    OFFICIAL_DOMAINS = {
        "ugcnet.nta.ac.in",
        "nta.ac.in",
        "ugcnetonline.in",
        "www.ugcnetonline.in",
        "ugc.gov.in",
        "www.ugc.gov.in",
        "education.gov.in",
        "inflibnet.ac.in",
        "swayam.gov.in",
        "nptel.ac.in"
    }

    @classmethod
    def is_allowed_source(cls, url: str) -> bool:
        if not url:
            return False
        parsed = urllib.parse.urlparse(url)
        return parsed.netloc.lower() in cls.OFFICIAL_DOMAINS

    @staticmethod
    def normalize_url(url: str) -> str:
        """Strips query parameters and URL fragments to produce the canonical reference."""
        if not url:
            return ""
        parsed = urllib.parse.urlparse(url)
        return urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))

    def generate_verification_report(self, db_path: str = None) -> Dict[str, Any]:
        """Audits all indexed resources in the database and generates JSON + CSV audit logs."""
        conn = get_db_connection(db_path)
        cursor = conn.cursor()

        # Audit papers
        cursor.execute("""
            SELECT p.id, p.title, p.exam_year, p.session, p.source_url, p.verification_status, 
                   s.name as subject_name,
                   (SELECT count(*) FROM answer_keys ak WHERE ak.paper_id = p.id) as has_key
            FROM question_papers p
            JOIN subjects s ON p.subject_id = s.id
        """)
        papers = cursor.fetchall()

        total = len(papers)
        verified_count = 0
        broken_links = 0
        missing_keys = 0
        audit_rows = []

        for p in papers:
            is_valid_domain = self.is_allowed_source(p["source_url"])
            has_key = p["has_key"] > 0
            if is_valid_domain and p["verification_status"] == "Verified Official":
                verified_count += 1
            else:
                broken_links += 1
            
            if not has_key:
                missing_keys += 1

            audit_rows.append({
                "paper_id": p["id"],
                "subject": p["subject_name"],
                "title": p["title"],
                "exam_year": p["exam_year"],
                "session": p["session"],
                "source_url": p["source_url"],
                "is_official_domain": is_valid_domain,
                "has_answer_key": has_key,
                "verification_status": p["verification_status"]
            })

        conn.close()

        v_percent = round((verified_count / total * 100), 2) if total > 0 else 0.0

        report = {
            "total_resources_audited": total,
            "verified_sources": verified_count,
            "broken_or_unverified_links": broken_links,
            "missing_answer_keys": missing_keys,
            "verification_percentage": v_percent,
            "official_authority": "National Testing Agency (NTA) & University Grants Commission (UGC)",
            "audit_date": "2026-10-14",
            "items": audit_rows
        }

        # Export reports to reports/
        reports_dir = os.path.join(BASE_DIR, "reports")
        os.makedirs(reports_dir, exist_ok=True)
        
        # JSON export
        json_path = os.path.join(reports_dir, "verification_report.json")
        with open(json_path, "w", encoding="utf-8") as jf:
            json.dump(report, jf, indent=2)

        # CSV export
        csv_path = os.path.join(reports_dir, "verification_report.csv")
        with open(csv_path, "w", newline="", encoding="utf-8") as cf:
            writer = csv.DictWriter(cf, fieldnames=[
                "paper_id", "subject", "title", "exam_year", "session", 
                "source_url", "is_official_domain", "has_answer_key", "verification_status"
            ])
            writer.writeheader()
            writer.writerows(audit_rows)

        return report

if __name__ == "__main__":
    validator = LinkValidator()
    rep = validator.generate_verification_report()
    print("Verification Audit Complete:", rep["verification_percentage"], "% verified.")
