#!/usr/bin/env python3
"""
Static API Data Exporter for UGC NET Smart Preparation Portal
Exports all dynamic database entities to static JSON endpoints in frontend/api/
Enables zero-latency, serverless deployment on Vercel Edge CDN.
"""

import os
import sys
import json
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
API_DIR = os.path.join(FRONTEND_DIR, "api")
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from api.service import UgcNetService
from validators.link_validator import LinkValidator

def export_all():
    os.makedirs(API_DIR, exist_ok=True)

    def write_json(rel_path, data):
        if not rel_path.endswith(".json"):
            rel_path = rel_path + ".json"
        full_path = os.path.join(API_DIR, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    print("Exporting static API endpoints...")

    # 1. Health
    health_data = UgcNetService.get_health()
    write_json("health", health_data)

    # 2. Subjects
    subjects = UgcNetService.get_subjects()
    write_json("subjects", subjects)

    # 3. Analytics Overview
    analytics = UgcNetService.get_analytics_overview()
    write_json("analytics/overview", analytics)

    # 4. Papers
    papers = UgcNetService.get_papers()
    write_json("papers", papers)
    for p in papers:
        p_details = UgcNetService.get_paper_details(p["id"])
        write_json(f"papers/{p['id']}", p_details)

    # 5. Questions
    questions = UgcNetService.get_questions()
    write_json("questions", questions)

    # 6. Mock Tests
    mock_tests = UgcNetService.get_mock_tests()
    write_json("mock-tests", mock_tests)
    for t in mock_tests:
        t_details = UgcNetService.get_mock_test_details(t["id"])
        write_json(f"mock-tests/{t['id']}", t_details)

    # 7. Syllabus per subject
    for s in subjects:
        sub_id = s["id"]
        syllabus = UgcNetService.get_syllabus(sub_id)
        write_json(f"syllabus/{sub_id}", syllabus)

        kg = UgcNetService.get_knowledge_graph(sub_id)
        write_json(f"knowledge-graph/{sub_id}", kg)

    # 8. Career resources
    career = UgcNetService.get_career_resources()
    write_json("career", career)

    # 9. Verification report
    report = LinkValidator().generate_verification_report()
    write_json("verification-report", report)

    print("All static API endpoints successfully exported to frontend/api/!")

if __name__ == "__main__":
    export_all()
