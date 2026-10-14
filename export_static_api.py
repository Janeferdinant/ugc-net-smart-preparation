import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from api.service import UgcNetService
from validators.link_validator import LinkValidator

def export_all():
    api_dir = os.path.join(BASE_DIR, "frontend", "api")
    os.makedirs(api_dir, exist_ok=True)
    
    # 1. Health
    health = UgcNetService.get_health()
    with open(os.path.join(api_dir, "health.json"), "w", encoding="utf-8") as f:
        json.dump(health, f, indent=2)
        
    # 2. Subjects
    subjects = UgcNetService.get_subjects()
    with open(os.path.join(api_dir, "subjects.json"), "w", encoding="utf-8") as f:
        json.dump(subjects, f, indent=2)
        
    # 3. Overview Analytics
    overview = UgcNetService.get_analytics_overview()
    os.makedirs(os.path.join(api_dir, "analytics"), exist_ok=True)
    with open(os.path.join(api_dir, "analytics", "overview.json"), "w", encoding="utf-8") as f:
        json.dump(overview, f, indent=2)
        
    # 4. Papers
    papers = UgcNetService.get_papers()
    with open(os.path.join(api_dir, "papers.json"), "w", encoding="utf-8") as f:
        json.dump(papers, f, indent=2)
        
    # 5. Questions
    questions = UgcNetService.get_questions()
    with open(os.path.join(api_dir, "questions.json"), "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=2)
        
    # 6. Mock tests list
    mock_tests = UgcNetService.get_mock_tests()
    with open(os.path.join(api_dir, "mock-tests.json"), "w", encoding="utf-8") as f:
        json.dump(mock_tests, f, indent=2)
        
    # 7. Mock tests individual
    mock_dir = os.path.join(api_dir, "mock-tests")
    os.makedirs(mock_dir, exist_ok=True)
    for t in mock_tests:
        t_id = t["id"]
        t_detail = UgcNetService.get_mock_test_details(t_id)
        if t_detail:
            with open(os.path.join(mock_dir, f"{t_id}.json"), "w", encoding="utf-8") as f:
                json.dump(t_detail, f, indent=2)
                
    # Submit mock test mock response
    with open(os.path.join(mock_dir, "submit_mock.json"), "w", encoding="utf-8") as f:
        json.dump({
            "test_id": 6,
            "total_questions": 200,
            "attempted": 200,
            "correct": 178,
            "incorrect": 22,
            "score": 356,
            "max_score": 400,
            "accuracy_percent": 89.0,
            "qualifying_status": "QUALIFIED FOR JRF & ASSISTANT PROFESSOR (Percentile: 99.4%)",
            "section_breakdown": {
                "section_1_paper_1": {"attempted": 50, "correct": 46, "score": 92, "max_score": 100},
                "section_2_computer_science": {"attempted": 150, "correct": 132, "score": 264, "max_score": 300}
            }
        }, f, indent=2)

    # 8. Syllabus per subject
    syl_dir = os.path.join(api_dir, "syllabus")
    os.makedirs(syl_dir, exist_ok=True)
    for s in subjects:
        s_id = s["id"]
        units = UgcNetService.get_syllabus(s_id)
        with open(os.path.join(syl_dir, f"{s_id}.json"), "w", encoding="utf-8") as f:
            json.dump(units, f, indent=2)

    # 9. Knowledge Graph per subject
    kg_dir = os.path.join(api_dir, "knowledge-graph")
    os.makedirs(kg_dir, exist_ok=True)
    for s in subjects:
        s_id = s["id"]
        kg = UgcNetService.get_knowledge_graph(s_id)
        with open(os.path.join(kg_dir, f"{s_id}.json"), "w", encoding="utf-8") as f:
            json.dump(kg, f, indent=2)
            
    # 10. Career
    career = UgcNetService.get_career_resources()
    with open(os.path.join(api_dir, "career.json"), "w", encoding="utf-8") as f:
        json.dump(career, f, indent=2)
        
    # 11. Verification report
    import shutil
    shutil.copyfile(os.path.join(BASE_DIR, "reports", "verification_report.json"), os.path.join(api_dir, "verification-report.json"))
        
    print(f"Successfully exported static API files to {api_dir}")

if __name__ == "__main__":
    export_all()
