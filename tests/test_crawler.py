import os
import sys
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

class TestCrawlerAndValidators(unittest.TestCase):
    def test_link_validator_checks(self):
        from validators.link_validator import LinkValidator
        validator = LinkValidator()
        
        # Test valid NTA / UGC domain checks
        self.assertTrue(validator.is_allowed_source("https://ugcnet.nta.ac.in/archive/2024/paper.pdf"))
        self.assertTrue(validator.is_allowed_source("https://www.ugcnetonline.in/syllabus.php"))
        self.assertFalse(validator.is_allowed_source("https://unverified-malicious-site.com/cheat.pdf"))

        # Test canonical URL normalization
        norm = validator.normalize_url("https://ugcnet.nta.ac.in/archive/2024/paper.pdf?ref=test#section1")
        self.assertEqual(norm, "https://ugcnet.nta.ac.in/archive/2024/paper.pdf")

    def test_hash_deduplication(self):
        from crawler.crawler import compute_sha256
        content_a = b"UGC NET Computer Science Question Paper 2024"
        content_b = b"UGC NET Computer Science Question Paper 2024"
        content_c = b"UGC NET Paper 1 2023"

        hash_a = compute_sha256(content_a)
        hash_b = compute_sha256(content_b)
        hash_c = compute_sha256(content_c)

        self.assertEqual(hash_a, hash_b)
        self.assertNotEqual(hash_a, hash_c)
        self.assertEqual(len(hash_a), 64)

    def test_audit_report_generation(self):
        from validators.link_validator import LinkValidator
        validator = LinkValidator()
        report = validator.generate_verification_report()
        self.assertIn("total_resources_audited", report)
        self.assertIn("verified_sources", report)
        self.assertIn("verification_percentage", report)
        self.assertGreaterEqual(report["total_resources_audited"], 10)

if __name__ == "__main__":
    unittest.main()
