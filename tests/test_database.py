import os
import sys
import sqlite3
import unittest

# Ensure backend is on sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

class TestDatabase(unittest.TestCase):
    def test_init_db_creates_tables(self):
        from database.db import get_db_connection, init_db
        test_db = os.path.join(BASE_DIR, "tests", "test_ugc_net.db")
        if os.path.exists(test_db):
            os.remove(test_db)
        
        conn = get_db_connection(test_db)
        init_db(conn)
        
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        
        expected_tables = [
            "subjects", "syllabus_units", "question_papers", 
            "answer_keys", "questions", "mock_tests", 
            "user_progress", "crawler_logs", "career_resources"
        ]
        for table in expected_tables:
            self.assertIn(table, tables, f"Expected table '{table}' not found in database")
        conn.close()
        if os.path.exists(test_db):
            os.remove(test_db)

    def test_seed_initial_data(self):
        from database.db import get_db_connection, init_db
        from database.seed_data import seed_initial_data

        test_db = os.path.join(BASE_DIR, "tests", "test_seed.db")
        if os.path.exists(test_db):
            os.remove(test_db)
            
        conn = get_db_connection(test_db)
        init_db(conn)
        seed_result = seed_initial_data(conn)
        
        cursor = conn.cursor()
        
        # Verify official subjects
        cursor.execute("SELECT code, name, is_official FROM subjects WHERE is_official = 1")
        official_subjects = cursor.fetchall()
        codes = [row[0] for row in official_subjects]
        self.assertIn("00", codes, "Paper 1 (Code 00) must be present")
        self.assertIn("87", codes, "Computer Science (Code 87) must be present")
        self.assertIn("88", codes, "Electronic Science (Code 88) must be present")
        
        # Verify syllabus units: Paper 1 must have 10 units, CS must have 10 units
        cursor.execute("SELECT count(*) FROM syllabus_units WHERE subject_id = (SELECT id FROM subjects WHERE code = '00')")
        p1_units = cursor.fetchone()[0]
        self.assertEqual(p1_units, 10, f"Paper 1 should have 10 units, got {p1_units}")
        
        cursor.execute("SELECT count(*) FROM syllabus_units WHERE subject_id = (SELECT id FROM subjects WHERE code = '87')")
        cs_units = cursor.fetchone()[0]
        self.assertEqual(cs_units, 10, f"Computer Science should have 10 units, got {cs_units}")

        # Verify Question Papers & Answer Keys exist
        cursor.execute("SELECT count(*) FROM question_papers")
        paper_count = cursor.fetchone()[0]
        self.assertGreaterEqual(paper_count, 10, f"Expected at least 10 question papers, got {paper_count}")

        cursor.execute("SELECT count(*) FROM answer_keys")
        ak_count = cursor.fetchone()[0]
        self.assertGreaterEqual(ak_count, 10, f"Expected linked answer keys for papers, got {ak_count}")

        # Verify Solved Questions exist
        cursor.execute("SELECT count(*) FROM questions")
        q_count = cursor.fetchone()[0]
        self.assertGreaterEqual(q_count, 20, f"Expected at least 20 solved questions, got {q_count}")

        conn.close()
        if os.path.exists(test_db):
            os.remove(test_db)

if __name__ == "__main__":
    unittest.main()
