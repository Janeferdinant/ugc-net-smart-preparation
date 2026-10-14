#!/usr/bin/env python3
"""
UGC NET Smart Preparation Portal — Unified Local Server
Author: Jane Rose | Asst. Professor | CSE

Launches both the REST API (/api/*) and the responsive Glassmorphism frontend on a single port.
Zero external dependencies required (Python standard library http.server).
"""

import os
import sys
import json
import mimetypes
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from api.service import UgcNetService
from validators.link_validator import LinkValidator

class UgcNetUnifiedHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def _set_api_headers(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        if self.path.startswith("/api/"):
            self._set_api_headers(204)
        else:
            super().do_OPTIONS()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        def get_param(name, cast_fn=None):
            val = query.get(name, [None])[0]
            if val is not None and cast_fn:
                try:
                    return cast_fn(val)
                except Exception:
                    return None
            return val

        # Handle API routes
        if path.startswith("/api/"):
            try:
                if path == "/api/health":
                    data = UgcNetService.get_health()
                elif path == "/api/subjects":
                    data = UgcNetService.get_subjects()
                elif path.startswith("/api/syllabus/"):
                    sub_id = int(path.split("/")[-1])
                    data = UgcNetService.get_syllabus(sub_id)
                elif path == "/api/papers":
                    sub_id = get_param("subject_id", int)
                    yr = get_param("year", int)
                    sess = get_param("session")
                    data = UgcNetService.get_papers(sub_id, yr, sess)
                elif path.startswith("/api/papers/"):
                    p_id = int(path.split("/")[-1])
                    data = UgcNetService.get_paper_details(p_id)
                elif path == "/api/questions":
                    sub_id = get_param("subject_id", int)
                    unit_id = get_param("unit_id", int)
                    diff = get_param("difficulty")
                    data = UgcNetService.get_questions(sub_id, unit_id, diff)
                elif path == "/api/mock-tests":
                    sub_id = get_param("subject_id", int)
                    data = UgcNetService.get_mock_tests(sub_id)
                elif path.startswith("/api/mock-tests/"):
                    t_id = int(path.split("/")[-1])
                    data = UgcNetService.get_mock_test_details(t_id)
                elif path == "/api/analytics/overview":
                    data = UgcNetService.get_analytics_overview()
                elif path.startswith("/api/knowledge-graph/"):
                    sub_id = int(path.split("/")[-1])
                    data = UgcNetService.get_knowledge_graph(sub_id)
                elif path == "/api/career":
                    data = UgcNetService.get_career_resources()
                elif path == "/api/verification-report":
                    data = LinkValidator().generate_verification_report()
                elif path == "/api/study-plan/30-days":
                    data = UgcNetService.get_study_plan_30_days()
                else:
                    self._set_api_headers(404)
                    self.wfile.write(json.dumps({"error": f"Endpoint '{path}' not found"}).encode("utf-8"))
                    return

                self._set_api_headers(200)
                self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))
                return

            except Exception as e:
                self._set_api_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        # Otherwise serve static files from frontend/
        if path == "/" or not os.path.exists(os.path.join(FRONTEND_DIR, path.lstrip("/"))):
            # Fallback to index.html for SPA routing
            self.path = "/index.html"

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8")
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            payload = {}

        if path == "/api/mock-tests/submit":
            test_id = payload.get("test_id")
            answers = payload.get("user_answers", {})
            result = UgcNetService.evaluate_test_submission(test_id, answers)
            self._set_api_headers(200)
            self.wfile.write(json.dumps(result, indent=2).encode("utf-8"))
        else:
            self._set_api_headers(404)
            self.wfile.write(json.dumps({"error": "POST endpoint not found"}).encode("utf-8"))

    def end_headers(self):
        # Ensure correct JavaScript module MIME type
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        super().end_headers()

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, UgcNetUnifiedHandler)
    print("=" * 70)
    print("UGC NET SMART PREPARATION PORTAL")
    print("Brand: Jane Rose | Asst. Professor | CSE")
    print(f"Portal running at: http://localhost:{port}")
    print(f"REST API Health:   http://localhost:{port}/api/health")
    print("=" * 70)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer terminated by user.")

if __name__ == "__main__":
    main()
