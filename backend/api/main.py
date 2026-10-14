import os
import sys
from typing import Optional, Dict
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from api.service import UgcNetService
from validators.link_validator import LinkValidator

app = FastAPI(
    title="UGC NET Smart Preparation Portal API",
    description="Backend API for research crawler, official syllabi, PYQs, answer keys, and quizzes. Brand: Jane Rose | Asst. Professor | CSE",
    version="1.0.0"
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestSubmission(BaseModel):
    test_id: int
    user_answers: Dict[str, str]

@app.get("/api/health")
def get_health():
    return UgcNetService.get_health()

@app.get("/api/subjects")
def get_subjects():
    return UgcNetService.get_subjects()

@app.get("/api/syllabus/{subject_id}")
def get_syllabus(subject_id: int):
    units = UgcNetService.get_syllabus(subject_id)
    if not units:
        raise HTTPException(status_code=404, detail="Subject not found or has no units")
    return units

@app.get("/api/papers")
def get_papers(
    subject_id: Optional[int] = None, 
    year: Optional[int] = None, 
    session: Optional[str] = None
):
    return UgcNetService.get_papers(subject_id, year, session)

@app.get("/api/papers/{paper_id}")
def get_paper(paper_id: int):
    paper = UgcNetService.get_paper_details(paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@app.get("/api/questions")
def get_questions(
    subject_id: Optional[int] = None, 
    unit_id: Optional[int] = None, 
    difficulty: Optional[str] = None
):
    return UgcNetService.get_questions(subject_id, unit_id, difficulty)

@app.get("/api/mock-tests")
def get_mock_tests(subject_id: Optional[int] = None):
    return UgcNetService.get_mock_tests(subject_id)

@app.get("/api/mock-tests/{test_id}")
def get_mock_test(test_id: int):
    test = UgcNetService.get_mock_test_details(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Mock test not found")
    return test

@app.post("/api/mock-tests/submit")
def submit_mock_test(submission: TestSubmission):
    return UgcNetService.evaluate_test_submission(submission.test_id, submission.user_answers)

@app.get("/api/analytics/overview")
def get_analytics():
    return UgcNetService.get_analytics_overview()

@app.get("/api/knowledge-graph/{subject_id}")
def get_knowledge_graph(subject_id: int):
    return UgcNetService.get_knowledge_graph(subject_id)

@app.get("/api/career")
def get_career():
    return UgcNetService.get_career_resources()

@app.get("/api/verification-report")
def get_verification_report():
    validator = LinkValidator()
    return validator.generate_verification_report()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api.main:app", host="0.0.0.0", port=8000, reload=True)
