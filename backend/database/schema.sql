-- UGC NET Smart Preparation Portal Schema (SQLite)
-- Author: Jane Rose | Asst. Professor | CSE

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,            -- e.g. '00', '87', '88', 'SUPP-AI'
    name TEXT NOT NULL,                   -- e.g. 'General Paper on Teaching & Research Aptitude'
    category TEXT NOT NULL,               -- 'official_exam', 'supplementary'
    description TEXT,
    is_official INTEGER DEFAULT 1,        -- 1 = Official UGC NET, 0 = Supplementary
    icon TEXT,                            -- Lucide icon name
    total_units INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS syllabus_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    unit_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    weightage_percent INTEGER DEFAULT 10,
    description TEXT,
    topics_json TEXT NOT NULL,            -- JSON array of topic strings
    learning_outcomes TEXT,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    exam_year INTEGER NOT NULL,
    session TEXT NOT NULL,                -- 'June', 'December', 'Merged'
    shift TEXT NOT NULL DEFAULT 'Shift 1',-- 'Shift 1', 'Shift 2'
    paper_code TEXT NOT NULL,             -- 'Paper 1', 'Paper 2'
    title TEXT NOT NULL,
    file_path TEXT,                       -- Local relative or absolute path
    source_url TEXT NOT NULL,             -- Official NTA/UGC URL
    publication_date TEXT,
    file_size_bytes INTEGER DEFAULT 0,
    sha256_hash TEXT,
    verification_status TEXT NOT NULL,    -- 'Verified Official', 'Provisional', 'Archived', 'Unverified'
    total_questions INTEGER DEFAULT 50,
    total_marks INTEGER DEFAULT 100,
    is_available INTEGER DEFAULT 1,
    has_answer_key INTEGER DEFAULT 1,
    access_restrictions TEXT DEFAULT 'Open Educational Access',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answer_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paper_id INTEGER NOT NULL UNIQUE,
    key_type TEXT NOT NULL,               -- 'Final Official', 'Provisional', 'Expert Solved'
    publication_date TEXT,
    source_url TEXT NOT NULL,
    verification_status TEXT NOT NULL,    -- 'Verified Official', 'Provisional'
    sha256_hash TEXT,
    answers_matrix_json TEXT NOT NULL,    -- JSON map: {"1": "A", "2": "C", ...}
    dropped_questions_json TEXT DEFAULT '[]', -- JSON array of dropped Qs where full marks awarded
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(paper_id) REFERENCES question_papers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    unit_id INTEGER,
    paper_id INTEGER,
    question_number INTEGER,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL,         -- 'A', 'B', 'C', 'D'
    explanation TEXT,
    numerical_formula TEXT,
    common_pitfalls TEXT,
    difficulty TEXT DEFAULT 'Medium',     -- 'Easy', 'Medium', 'Hard'
    question_type TEXT DEFAULT 'MCQ',     -- 'MCQ', 'Assertion-Reason', 'Matching', 'Statement Based'
    year INTEGER,
    session TEXT,
    is_official_pyq INTEGER DEFAULT 1,
    FOREIGN KEY(subject_id) REFERENCES subjects(id),
    FOREIGN KEY(unit_id) REFERENCES syllabus_units(id),
    FOREIGN KEY(paper_id) REFERENCES question_papers(id)
);

CREATE TABLE IF NOT EXISTS mock_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject_id INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    total_questions INTEGER DEFAULT 50,
    total_marks INTEGER DEFAULT 100,
    passing_percentage REAL DEFAULT 40.0,
    marking_scheme TEXT DEFAULT '+2 for correct, 0 for incorrect/unattempted',
    questions_json TEXT NOT NULL,         -- JSON array of question IDs or objects
    difficulty TEXT DEFAULT 'Mixed',
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
);

CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'default_student',
    subject_id INTEGER NOT NULL,
    completed_topics_json TEXT DEFAULT '[]',
    bookmarks_json TEXT DEFAULT '[]',
    test_history_json TEXT DEFAULT '[]',
    daily_streak INTEGER DEFAULT 1,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(subject_id) REFERENCES subjects(id)
);

CREATE TABLE IF NOT EXISTS crawler_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crawl_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_url TEXT NOT NULL,
    http_status INTEGER,
    content_hash TEXT,
    items_found INTEGER DEFAULT 0,
    status_message TEXT,
    is_valid INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS career_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,                 -- 'Artificial Intelligence', 'Data Science', 'Academic Professorship'
    role_title TEXT NOT NULL,
    industry_sector TEXT,
    experience_level TEXT,
    salary_range_inr TEXT NOT NULL,       -- e.g. '₹ 12 - 28 LPA'
    key_skills_json TEXT NOT NULL,        -- JSON array
    educational_pathway TEXT,
    verified_sources TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
