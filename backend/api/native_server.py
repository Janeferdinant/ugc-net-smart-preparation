import os
import sys
import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from api.service import UgcNetService
from validators.link_validator import LinkValidator

class UgcNetApiHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Helpers
        def get_param(name, cast_fn=None):
            val = query.get(name, [None])[0]
            if val is not None and cast_fn:
                try:
                    return cast_fn(val)
                except Exception:
                    return None
            return val

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
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))
                return

            self._set_headers(200)
            self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8")
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            payload = {}

        try:
            if path == "/api/mock-tests/submit":
                test_id = payload.get("test_id")
                answers = payload.get("user_answers", {})
                result = UgcNetService.evaluate_test_submission(test_id, answers)
                self._set_headers(200)
                self.wfile.write(json.dumps(result, indent=2).encode("utf-8"))
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "POST endpoint not found"}).encode("utf-8"))
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))

    def log_message(self, format, *args):
        # Suppress noisy standard logs in quiet mode
        pass

def run_server(port=8000):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, UgcNetApiHandler)
    print(f"UGC NET Smart Portal Backend API running at http://127.0.0.1:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)
