import os
import sys
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from api.service import UgcNetService

class TestUgcNetApi(unittest.TestCase):
    def test_health_endpoint(self):
        health = UgcNetService.get_health()
        self.assertEqual(health["status"], "healthy")
        self.assertEqual(health["brand"], "Jane Rose | Asst. Professor | CSE")

    def test_subjects_endpoint(self):
        subjects = UgcNetService.get_subjects()
        self.assertGreaterEqual(len(subjects), 3)
        codes = [s["code"] for s in subjects]
        self.assertIn("00", codes)
        self.assertIn("87", codes)
        self.assertIn("88", codes)

    def test_syllabus_endpoint(self):
        # CS subject ID
        subjects = UgcNetService.get_subjects()
        cs_subj = next(s for s in subjects if s["code"] == "87")
        units = UgcNetService.get_syllabus(cs_subj["id"])
        self.assertEqual(len(units), 10)
        unit1 = units[0]
        self.assertIn("Discrete Structures", unit1["title"])
        self.assertGreaterEqual(len(unit1["topics"]), 5)

    def test_papers_and_answer_keys(self):
        papers = UgcNetService.get_papers()
        self.assertGreaterEqual(len(papers), 10)
        
        # Test paper details with answer key
        p1 = papers[0]
        details = UgcNetService.get_paper_details(p1["id"])
        self.assertIsNotNone(details)
        self.assertIsNotNone(details["answer_key"])
        self.assertIn("matrix", details["answer_key"])

    def test_quiz_evaluation_scoring(self):
        # Fetch first mock test
        tests = UgcNetService.get_mock_tests()
        self.assertGreaterEqual(len(tests), 1)
        test_id = tests[0]["id"]
        test_details = UgcNetService.get_mock_test_details(test_id)
        
        # Create answers that match correct options
        answers = {}
        for q in test_details["questions"]:
            answers[str(q["id"])] = q["correct_option"]

        result = UgcNetService.evaluate_test_submission(test_id, answers)
        self.assertEqual(result["correct_count"], len(test_details["questions"]))
        self.assertEqual(result["score_obtained"], len(test_details["questions"]) * 2)
        self.assertEqual(result["percentage"], 100.0)
        self.assertTrue(result["is_passed"])

    def test_analytics_overview(self):
        analytics = UgcNetService.get_analytics_overview()
        self.assertGreaterEqual(analytics["verified_question_papers"], 10)
        self.assertGreaterEqual(analytics["verified_answer_keys"], 10)
        self.assertGreaterEqual(analytics["syllabus_units"], 20)

    def test_knowledge_graph(self):
        subjects = UgcNetService.get_subjects()
        p1 = next(s for s in subjects if s["code"] == "00")
        kg = UgcNetService.get_knowledge_graph(p1["id"])
        self.assertIn("nodes", kg)
        self.assertIn("links", kg)
        self.assertGreaterEqual(len(kg["nodes"]), 11)

if __name__ == "__main__":
    unittest.main()
