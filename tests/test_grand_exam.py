import os
import sys
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from api.service import UgcNetService
from database.db import get_db_connection

class TestGrandExam(unittest.TestCase):
    def test_200_question_exam_exists(self):
        tests = UgcNetService.get_mock_tests()
        grand_exam = next((t for t in tests if t["total_questions"] == 200), None)
        self.assertIsNotNone(grand_exam, "A 200-question grand exam must exist")
        self.assertEqual(grand_exam["duration_minutes"], 180, "Duration must be 3 hours (180 minutes)")
        self.assertEqual(grand_exam["total_marks"], 400, "Total marks must be 400 (200 x 2)")

    def test_exam_has_6_years_content(self):
        tests = UgcNetService.get_mock_tests()
        grand_exam = next((t for t in tests if t["total_questions"] == 200), None)
        self.assertIsNotNone(grand_exam)
        details = UgcNetService.get_mock_test_details(grand_exam["id"])
        questions = details["questions"]
        self.assertEqual(len(questions), 200, "Must contain exactly 200 questions")

        years = set(q.get("year") for q in questions if q.get("year"))
        for expected_year in [2019, 2020, 2021, 2022, 2023, 2024]:
            self.assertIn(expected_year, years, f"Exam must include questions from {expected_year}")

    def test_exam_scoring_and_sections(self):
        tests = UgcNetService.get_mock_tests()
        grand_exam = next((t for t in tests if t["total_questions"] == 200), None)
        details = UgcNetService.get_mock_test_details(grand_exam["id"])
        questions = details["questions"]

        # Check answers evaluation
        answers = {str(q["id"]): q["correct_option"] for q in questions[:100]}
        result = UgcNetService.evaluate_test_submission(grand_exam["id"], answers)
        self.assertEqual(result["correct_count"], 100)
        self.assertEqual(result["score_obtained"], 200)
        self.assertEqual(result["max_marks"], 400)
        self.assertEqual(result["percentage"], 50.0)

if __name__ == "__main__":
    unittest.main()
